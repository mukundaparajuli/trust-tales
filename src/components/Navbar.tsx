"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { MessageCircle, LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogOut = () => {
    signOut({
      callbackUrl: "/sign-in",
    });
  };

  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-gray-300 transition-colors">
            <span>WhisperLink</span>
          </Link>

          <div className="flex items-center gap-6">
            {!session && (
              <>
                <Link href="/how-it-works" className="hidden md:block hover:text-gray-300 transition-colors">
                  How It Works
                </Link>
                <Link href="/sign-in">
                  <Button variant="ghost" className="hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gray-700 hover:bg-gray-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {session && (
              <>
                <Link href="/dashboard" className="hidden md:block hover:text-gray-300 transition-colors">
                  Dashboard
                </Link>
                <Link href="/how-it-works" className="hidden md:block hover:text-gray-300 transition-colors">
                  How It Works
                </Link>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">{user?.username || user?.email || "User"}</span>
                  </div>
                  <Button
                    onClick={handleLogOut}
                    variant="ghost"
                    className="hover:bg-gray-200 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Log Out</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
