import { Collections, db } from "@/app/firebase/client";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getUser } from "../getUser";
import { plaid } from "../plaid";

export async function POST(request: Request) {
  const user = await getUser(request);

  const body = await request.json();
  const publicToken = body.publicToken;

  // take the public token from the client and exchange it for an access token to their bank account
  const exchangeResponse = await plaid.itemPublicTokenExchange({
    public_token: publicToken,
  });

  if (exchangeResponse.status !== 200) {
    return new Response(JSON.stringify(exchangeResponse.data), { status: 500 });
  }

  console.log(
    "POST /api/createAccessToken: Exchanged public token for an access token"
  );

  const accessToken = exchangeResponse.data.access_token;

  // store the access token in firestore
  await setDoc(doc(db, Collections.plaidAccessTokens, user.uid), {
    accessToken,
  });

  console.log("POST /api/createAccessToken: Stored access token in firestore");

  // store account info in firebase under accounts collection
  const accountsResponse = await plaid.accountsGet({
    access_token: accessToken,
  });

  if (accountsResponse.status !== 200) {
    throw new Error("Invalid access token");
  }

  const accounts = accountsResponse.data.accounts;
  accounts.forEach(async (account) => {
    await addDoc(collection(db, Collections.accounts), {
      balance: account.balances.current,
      name: account.name,
      officialName: account.official_name,
      isoCurrencyCode: account.balances.iso_currency_code,
      uid: user.uid,
    });
  });

  return new Response();
}
