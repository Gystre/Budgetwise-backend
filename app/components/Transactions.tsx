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
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Currency
            </th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td className="py-2 px-4 border-b border-gray-200">
                {transaction.date}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {transaction.name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {transaction.amount}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {transaction.iso_currency_code ||
                  transaction.unofficial_currency_code}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {transaction.category ? transaction.category.join(", ") : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {transactions.map((transaction) => (
        <div key={transaction.transaction_id}>
          ${transaction.amount} {transaction.iso_currency_code} -{" "}
          {transaction.name}
        </div>
      ))} */}
    </div>
  );
};
