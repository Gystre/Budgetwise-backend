"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { CgSpinnerAlt } from "react-icons/cg";
import { PlaidLink } from "react-plaid-link";
import { toast } from "react-toastify";
import { Accounts } from "../components/Accounts";
import { Transactions } from "../components/Transactions";
import { auth } from "../firebase/client";

export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [loading] = useAuthState(auth);
  const [loadingResponse, setLoadingResponse] = useState(true);
  const [hasAccessToken, setHasAccessToken] = useState(false);

  useEffect(() => {
    (async () => {
      const idToken = await auth.currentUser?.getIdToken();

      // it's possible that this useEffect is called before the user is loaded
      if (!idToken) {
        return;
      }

      // check if the user has an access token already
      setLoadingResponse(true);
      const accessTokenResponse = await fetch("/api/accessTokens", {
        headers: {
          "Id-Token": (await auth.currentUser?.getIdToken()) as string,
        },
      });

      // user has an access token already, don't let them connect another bank account
      if (accessTokenResponse.status === 200) {
        setLoadingResponse(false);
        setHasAccessToken(true);
        return;
      }

      const response = await fetch("/api/createLinkToken", {
        method: "POST",
        headers: {
          "Id-Token": (await auth.currentUser?.getIdToken()) as string,
        },
      });
      setLoadingResponse(false);

      if (!response.ok) {
        toast.error(
          "Something went wrong with fetching the link token from the server :("
        );
        return;
      }

      const data = await response.json();
      setLinkToken(data.linkToken);
    })();
  }, [loading]);

  let linkButton;
  if (!loadingResponse && !hasAccessToken) {
    linkButton = (
      <PlaidLink
        token={linkToken}
        onSuccess={async (publicToken, metadata) => {
          console.log(publicToken, metadata);

          // send the public token to the server to get an access token
          const response = await fetch("/api/createAccessToken", {
            method: "POST",
            headers: {
              "Id-Token": (await auth.currentUser?.getIdToken()) as string,
            },
            body: JSON.stringify({
              publicToken,
            }),
          });

          if (!response.ok) {
            toast.error(
              "Something went wrong with creating the access token :("
            );
            console.log(await response.text());
            return;
          }

          toast.success("Successfully connected bank account!");
        }}
      >
        Connect a bank account
      </PlaidLink>
    );
  } else if (!loadingResponse && hasAccessToken) {
    // user already has a bank account connected
    linkButton = null;
  } else if (loadingResponse) {
    linkButton = <CgSpinnerAlt className="animate-spin" size={32} />;
  }

  return (
    <div className="flex flex-col mx-4 md:mx-16 mt-10">
      <div>{linkButton}</div>
      <h1 className="text-h4 font-bold">Accounts:</h1>
      {hasAccessToken && <Accounts />}
      <div className="mb-8"></div>
      <h1 className="text-h4 font-bold">Transactions:</h1>
      {hasAccessToken && <Transactions />}
    </div>
  );
}
