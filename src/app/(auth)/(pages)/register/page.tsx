"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../config/FireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useUser } from "../../../context/UserProvider";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MdErrorOutline } from "react-icons/md";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { UserDataTypes } from "@/app/Types/UserDataTypes";
import { UserDataErrorTypes } from "@/app/Types/UserDataErrorTypes";

function Page() {
  const { login, user } = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataTypes>({
    email: "",
    password: "",
    userName: "",
    firstName: "",
    lastName: "",
    uid: "",
  });

  const [error, setError] = useState<UserDataErrorTypes>({
    email: "",
    password: "",
    userName: "",
    firstName: "",
    lastName: "",
  });

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError: boolean = false;
    setError({
      email: "",
      password: "",
      userName: "",
      firstName: "",
      lastName: "",
    });

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userData.email) {
      setError((prev) => ({ ...prev, email: "Please enter your email." }));
      hasError = true;
    } else if (!emailRegex.test(userData.email)) {
      setError((prev) => ({ ...prev, email: "Please enter a valid email." }));
      hasError = true;
    }

    if (!userData.password || userData.password.length < 8) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters.",
      }));
      hasError = true;
    }

    if (!userData.userName) {
      setError((prev) => ({
        ...prev,
        username: "Please enter a username.",
      }));
      hasError = true;
    }

    if (!userData.firstName) {
      setError((prev) => ({
        ...prev,
        firstName: "Please enter your first name.",
      }));
      hasError = true;
    }

    if (!userData.lastName) {
      setError((prev) => ({
        ...prev,
        lastName: "Please enter your last name.",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
      });

      login({
        uid: user.uid,
        email: user.email ?? "",
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
      });

      router.push("/");
    } catch (error: any) {
      setError((prev) => ({
        ...prev,
        password: error.message,
      }));
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

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          firstName: user.displayName?.split(" ")[0] || "First",
          lastName: user.displayName?.split(" ")[1] || "Last",
          userName: user.email?.split("@")[0] || "Email",
        });
      }

      login({
        uid: user.uid,
        email: user.email ?? "",
        firstName: user.displayName?.split(" ")[0] || "First",
        lastName: user.displayName?.split(" ")[1] || "Last",
        userName: user.email?.split("@")[0] || "Email",
      });

      router.push("/");
    } catch (error: any) {
      setError((prev) => ({
        ...prev,
        password: error.message,
      }));
    }
  };

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-gray">
      {!user && (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <div className="relative flex items-center mb-4 w-full">
            <h3 className="text-lg text-blue absolute left-0 hover:text-blue-hover">
              <Link className="flex items-center" href="/">
                <IoIosArrowRoundBack />
                Back
              </Link>
            </h3>
            <h2 className="text-2xl font-bold text-black mx-auto">Login</h2>
          </div>

          <form onSubmit={handleRegister} noValidate>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-black mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {error.firstName && (
                <div className="my-2 text-red-500 text-sm flex items-center gap-1">
                  {error.firstName} <MdErrorOutline />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-black mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
                placeholder="Enter your last name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {error.lastName && (
                <div className="my-2 text-red-500 text-sm flex items-center gap-1">
                  {error.lastName} <MdErrorOutline />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-black mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={userData.userName}
                onChange={(e) =>
                  setUserData({ ...userData, userName: e.target.value })
                }
                placeholder="Enter your username"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {error.userName && (
                <div className="my-2 text-red-500 text-sm flex items-center gap-1">
                  {error.userName} <MdErrorOutline />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {error.email && (
                <div className="my-2 text-red-500 text-sm flex items-center gap-1">
                  {error.email} <MdErrorOutline />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
              />
              {error.password && (
                <div className="my-2 text-red-500 text-sm flex items-center gap-1">
                  {error.password} <MdErrorOutline />
                </div>
              )}
              <Link
                href="/forgotpassword"
                className="text-sm text-blue hover:underline flex pt-2 justify-end"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex justify-between mb-4">
              <button
                type="submit"
                aria-label="Register"
                className="cursor-pointer w-full py-3 bg-blue text-white rounded-md hover:bg-blue-hover transition duration-200"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              aria-label="Login with Google"
              onClick={() => handleSocialLogin(googleProvider)}
              className="cursor-pointer w-full py-3 bg-white text-black border-2 border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
            >
              <FaGoogle /> Login with Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              aria-label="Login with Github"
              onClick={() => handleSocialLogin(githubProvider)}
              className="cursor-pointer w-full py-3 bg-white text-black border-2 border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
            >
              <FaGithub /> Login with GitHub
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-sm text-black">
              Already have an account?{" "}
            </span>
            <Link href="/login" className="text-blue hover:underline">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
