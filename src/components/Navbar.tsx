"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogOut = () => {
    signOut({
      callbackUrl: "/sign-in", // Redirect to sign-in page after logout
    });
  };

  const user: User = session?.user as User;

  return (
    <div className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Trust Tales
        </a>
        {session ? (
          <>
            <span>Welcome, {user?.name ?? "User"}</span>
            <button onClick={handleLogOut} className="ml-4">
              Log Out
            </button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <button>Sign In</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
