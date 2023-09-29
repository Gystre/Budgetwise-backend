import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { getUser } from "../getUser";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET_SANDBOX,
    },
  },
});

const plaid = new PlaidApi(configuration);

/*
POST /api/createLinkToken

Create a link token for the user so they can access plaid services from the frontend.
*/

export async function POST(request: Request) {
  const user = await getUser(request);

  try {
    const response = await plaid.linkTokenCreate({
      user: {
        client_user_id: user.uid,
      },
      client_name: "Plaid Test App",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    console.log("POST /api/createLinkToken: Created a link token for the user");

    return new Response(
      JSON.stringify({ linkToken: response.data.link_token })
    );
  } catch (error: any) {
    throw new Error(error);
  }
}
