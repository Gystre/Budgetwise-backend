import { Transaction } from "plaid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase/client";

interface TransactionsProps {}

export const Transactions: React.FC<TransactionsProps> = ({}) => {
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/transactions", {
        headers: {
          "Id-Token": (await auth.currentUser?.getIdToken()) as string,
        },
      });

      if (!response.ok) {
        toast.error("Something went wrong with fetching your transactions :(");
        return;
      }

      const data = await response.json();
      setTransactions(data);
    })();
  }, []);

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.transaction_id}>{transaction.name}</div>
      ))}
    </div>
  );
};
