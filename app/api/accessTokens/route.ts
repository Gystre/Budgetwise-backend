import { Collections, db } from "@/app/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { getUser } from "../getUser";
import { plaid } from "../plaid";

/*
GET /api/accessTokens

User will check this endpoint to see if they already have an access token.
If they do then that means they've already linked their bank account.

Each bank account should ideally have their own access token but for now we'll just allow one bank account per user.

This endpoint won't actually return anything bc the access token is sensitive info
*/

export async function GET(request: Request) {
  const user = await getUser(request);

  const accessTokenDoc = await getDoc(
    doc(db, Collections.plaidAccessTokens, user.uid)
  );

  if (!accessTokenDoc.exists()) {
    throw new Error("No access token found for this user");
  }

  const accessToken = accessTokenDoc.data().accessToken;

  //   check if it's valid
  const accounts_response = await plaid.accountsGet({
    access_token: accessToken,
  });

  if (accounts_response.status !== 200) {
    throw new Error("Invalid access token");
  }

  return new Response();
}
