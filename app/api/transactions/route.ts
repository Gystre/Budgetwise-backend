import { Collections, db } from "@/app/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { getUser } from "../getUser";
import { plaid } from "../plaid";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export async function GET(request: Request) {
  const user = await getUser(request);

  const accessTokenDoc = await getDoc(
    doc(db, Collections.plaidAccessTokens, user.uid)
  );

  if (!accessTokenDoc.exists()) {
    throw new Error("No access token found for this user");
  }

  const accessToken = accessTokenDoc.data().accessToken;

  const today = new Date();

  // Get the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // fetch the linked accounts
  const transactions = await plaid.transactionsGet({
    access_token: accessToken,
    start_date: formatDate(thirtyDaysAgo),
    end_date: formatDate(today),
  });

  if (transactions.status !== 200) {
    throw new Error("Invalid access token");
  }

  return new Response(JSON.stringify(transactions.data.transactions));
}
