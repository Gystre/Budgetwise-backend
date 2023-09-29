"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlaidLink } from "react-plaid-link";
import { auth } from "../firebase/client";

export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [loading] = useAuthState(auth);

  useEffect(() => {
    (async () => {
      const idToken = await auth.currentUser?.getIdToken();

      // it's possible that this useEffect is called before the user is loaded
      if (!idToken) {
        return;
      }

      const response = await fetch("/api/createLinkToken", {
        method: "POST",
        headers: {
          "Id-Token": (await auth.currentUser?.getIdToken()) as string,
        },
      });
      if (!response.ok) {
        alert("smth nwent wrong");
      }

      const data = await response.json();
      setLinkToken(data.linkToken);
    })();
  }, [loading]);

  return (
    <div className="flex flex-col mx-4 md:mx-16 mt-10">
      <h1 className="text-h4 font-bold">Dashboard</h1>
      <div>
        <PlaidLink
          token={linkToken}
          onSuccess={() => {
            console.log("uhh");
          }}
        >
          Connect a bank account
        </PlaidLink>
      </div>
    </div>
  );
}
