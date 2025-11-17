"use client";
import { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosCheckbox } from "react-icons/io";
import { auth } from "../../../config/FireBaseConfig";
import Link from "next/link";
import { useUser } from "@/app/context/UserProvider";
import clsx from "clsx";
import Loading from "@/app/components/Loading/Loading";

function Page() {
  const router = useRouter();
  const { user } = useUser();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setError("Please enter your email.");
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      <title>DBFM | Forgot Password</title>
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-md bg-white dark:bg-dark-2 p-8 rounded-lg shadow-xl">
          <div className="relative flex items-center mb-4 w-full">
            <h3 className="text-lg  text-blue absolute left-0 hover:text-blue-hover">
              <Link className="flex items-center" href="/login">
                <IoIosArrowRoundBack size={20} />
                Back
              </Link>
            </h3>
            <h2 className="text-2xl font-bold  mx-auto">Reset Password</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-1">
              <label className="block text-sm font-semibold  mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            {error && (
              <div className="my-2 mb-4 text-red text-sm flex items-center gap-1">
                {error} <MdErrorOutline />
              </div>
            )}

            {success && (
              <div className="my-2 text-green text-sm flex items-center gap-1">
                {success} <IoIosCheckbox />
              </div>
            )}

            <button
              type="submit"
              aria-label="send reset link button"
              disabled={loading}
              className={clsx(
                "w-full py-3 mt-7 rounded-md text-white transition duration-200",
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue hover:bg-blue-hover cursor-pointer"
              )}
            >
              {loading ? <Loading size={20} /> : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm ">Remembered your password? </span>
            <Link href="/login" className="text-blue hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
