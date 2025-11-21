"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../config/FireBaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useUser } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MdErrorOutline } from "react-icons/md";
import { IoIosCheckbox, IoIosArrowRoundBack } from "react-icons/io";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Loading from "@/app/components/Loading/Loading";
import clsx from "clsx";

function Page() {
  const { login, user } = useUser();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginText, setLoginText] = useState<string>("");
  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError("Please enter your email.");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    const passwordRegex = /^.{8,}$/;
    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        const completeUserData = {
          uid: user.uid,
          email: user.email ?? "",
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
        };

        login(completeUserData);
        router.push("/");
        setEmail("");
        setPassword("");
        setLoginText("Login successful.");
        setLoading(false);
      } else {
        setPasswordError("User data not found.");
      }
    } catch (error: any) {
      setPasswordError(error.message);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: GoogleAuthProvider | GithubAuthProvider
  ) => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completeUserData = {
          uid: user.uid,
          email: user.email ?? "",
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          photoURL: user.photoURL ?? "",
        };

        login(completeUserData);
        router.push("/");
      } else {
        const newUserData = {
          firstName: user.displayName?.split(" ")[0] || "First",
          lastName: user.displayName?.split(" ")[1] || "Last",
          userName: user.email?.split("@")[0] || "user",
          photoURL: user.photoURL || "",
        };

        await setDoc(userDocRef, newUserData);

        const completeUserData = {
          uid: user.uid,
          email: user.email ?? "",
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          userName: newUserData.userName,
          photoURL: newUserData.photoURL,
        };

        login(completeUserData);
        router.push("/");
      }
    } catch (error: any) {
      setPasswordError(error.message);
    }
  };

  return (
    <>
      <title>DBFM | Login</title>

      <div className="flex items-center p-6 mb-8 justify-center min-h-screen ">
        {!user && (
          <div className="w-full max-w-md bg-white dark:bg-dark-2 p-8 rounded-lg shadow-xl">
            <div className="relative flex items-center mb-4 w-full">
              <h3 className="text-lg  text-blue absolute left-0 hover:text-blue-hover">
                <Link className="flex items-center" href="/">
                  <IoIosArrowRoundBack size={20} />
                  Back
                </Link>
              </h3>
              <h2 className="text-2xl font-bold  mx-auto">Login</h2>
            </div>

            <form onSubmit={handleLogin} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold  mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                />
                {emailError && (
                  <div className="my-2 text-red text-sm flex items-center gap-1">
                    {emailError}
                    <MdErrorOutline />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold  mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                />
                {passwordError && (
                  <div className="my-2 text-red text-sm flex items-center gap-1">
                    {passwordError}
                    <MdErrorOutline />
                  </div>
                )}

                {loginText && (
                  <div className="my-2 text-green text-sm flex items-center gap-1">
                    {loginText}
                    <IoIosCheckbox />
                  </div>
                )}
                <Link
                  href="/forgotpassword"
                  className="text-sm text-blue hover:underline flex pt-2 justify-end"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                aria-label="Login button"
                disabled={loading}
                className={clsx(
                  "w-full py-3 rounded-md text-white transition duration-200",
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue hover:bg-blue-hover cursor-pointer"
                )}
              >
                {loading ? <Loading size={20} /> : "Login"}
              </button>
            </form>

            <div className="flex items-center py-6">
              <span className="flex-1 border-t"></span>
              <span className="px-3 text-dark dark:text-white">
                Or continue with
              </span>
              <span className="flex-1 border-t"></span>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleSocialLogin(googleProvider)}
                className="p-2 cursor-pointer w-full py-3 bg-white dark:bg-dark border-2 border-gray-300 rounded-md dark:hover:bg-gray-700 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
              >
                <FaGoogle /> Login with Google
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => handleSocialLogin(githubProvider)}
                className="p-2 cursor-pointer w-full py-3 bg-white dark:bg-dark border-2 border-gray-300 rounded-md dark:hover:bg-gray-700 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
              >
                <FaGithub /> Login with Github
              </button>
            </div>

            <div className="mt-4 text-center">
              <span>Dont have an account? </span>
              <Link href="/register" className="text-blue hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
