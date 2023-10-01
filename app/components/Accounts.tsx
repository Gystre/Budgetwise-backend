import { AccountBase } from "plaid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase/client";

interface AccountsProps {}

// fetch /api/accounts and display all the accounts associated with the access token
export const Accounts: React.FC<AccountsProps> = ({}) => {
  const [accounts, setAccounts] = useState<Array<AccountBase>>([]);

  useEffect(() => {
    (async () => {
      const accountsResponse = await fetch("/api/accounts", {
        headers: {
          "Id-Token": (await auth.currentUser?.getIdToken()) as string,
        },
      });

      if (!accountsResponse.ok) {
        toast.error("Something went wrong with fetching your accounts :(");
        return;
      }

      const data = await accountsResponse.json();

      setAccounts(data);
    })();
  }, []);

  return (
    <div>
      {accounts.map((account) => (
        <div key={account.account_id}>
          ${account.balances.current} {account.balances.iso_currency_code} -{" "}
          {account.official_name}
        </div>
      ))}
    </div>
  );
};
