import { Collections, db } from "@/app/firebase/client";
import { doc, setDoc } from "firebase/firestore";
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

  return new Response();
}
