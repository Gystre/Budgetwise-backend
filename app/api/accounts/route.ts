import { Collections, db } from "@/app/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { getUser } from "../getUser";
import { plaid } from "../plaid";

export async function GET(request: Request) {
  const user = await getUser(request);

  const accessTokenDoc = await getDoc(
    doc(db, Collections.plaidAccessTokens, user.uid)
  );

  if (!accessTokenDoc.exists()) {
    throw new Error("No access token found for this user");
  }

  const accessToken = accessTokenDoc.data().accessToken;

  // fetch the linked accounts
  const accounts_response = await plaid.accountsGet({
    access_token: accessToken,
  });

  if (accounts_response.status !== 200) {
    throw new Error("Invalid access token");
  }

  return new Response(JSON.stringify(accounts_response.data.accounts));
}
