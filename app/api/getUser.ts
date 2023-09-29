import { auth } from "../firebase/server";

/*
Use this function to verify the user's session.
*/

export const getUser = async (request: Request) => {
  const idToken = request.headers.get("Id-Token");

  if (!idToken) {
    throw new Error(
      "Missing Id-Token value in the header. Did you forget to pass it in the fetch call?"
    );
  }

  return await auth.verifyIdToken(idToken);
};
