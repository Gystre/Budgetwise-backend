"use client";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/client";

export default function Home() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-h4">
        Welcom to da budgetwise intern challenge app!!!
      </h1>
      <img src="/anime-lucky-star.gif" />
      <div className="mb-8" />
      Login here:
      <button
        onClick={async () => {
          if (user) {
            router.push("/dashboard");
          } else {
            router.push("/login");
          }
        }}
        className="text-h5 bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-8 py-4"
      >
        Start Now
      </button>
    </main>
  );
}
