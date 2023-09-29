"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/client";

export default function Login() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-h3 font-bold mb-4">Login/Register</h1>
      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          const userInfo = await signInWithPopup(auth, provider);

          router.push("/dashboard");
        }}
        className="flex items-center bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300"
      >
        <FcGoogle className="mr-2" size={32} /> Continue with Google
      </button>
    </div>
  );
}
