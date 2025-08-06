import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import { FileBarChart } from "lucide-react";

const header = async () => {
  await checkUser(); // clerk middleware
  return (
    <div className="fixed top-0 w-full bg-transparent backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between space-x-0">
        <Link href="/" className="flex items-center space-x-0">
          <Image
            src={"/logooo.png"}
            alt="Nivesto logo"
            height={180}
            width={100}
            className="h-15 w-14 object-contain"
          />
          <span className="text-gray-400 font-bold text-lg">Nivesto</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* <SignedIn>
            <Link
              href={"/dashboard"}
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button className="gradient" variant="outline">
                <LayoutDashboard size={18}></LayoutDashboard>
                <span className="hidden md:inline text-white">Dashboard</span>
              </Button>
            </Link>
            <Link
              href="/reports"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button className="gradient" variant="outline">
                <FileBarChart size={18} />
                <span className="hidden md:inline text-white">Reports</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button className="flex items-center gap-2">
                <PenBox size={18}></PenBox>
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn> */}

          <SignedIn>
  {/* Dashboard Button */}
  <Link href="/dashboard">
    <Button
      className={`
        px-2 md:px-4 py-2
        bg-transparent md:bg-green-600
        text-green-600 md:text-white
        hover:bg-transparent md:hover:bg-green-600
        hover:text-green-600 md:hover:text-black
        flex items-center gap-2
        border-none shadow-none
        transition-none md:transition-colors
      `}
    >
      <LayoutDashboard
        size={20}
        className="text-green-600 md:text-white md:hover:text-black"
      />
      <span className="hidden md:inline">Dashboard</span>
    </Button>
  </Link>

  {/* Reports Button */}
  <Link href="/reports">
    <Button
      className={`
        px-2 md:px-4 py-2
        bg-transparent md:bg-green-600
        text-green-600 md:text-white
        hover:bg-transparent md:hover:bg-green-600
        hover:text-green-600 md:hover:text-black
        flex items-center gap-2
        border-none shadow-none
        transition-none md:transition-colors
      `}
    >
      <FileBarChart
        size={20}
        className="text-green-600 md:text-white md:hover:text-black"
      />
      <span className="hidden md:inline">Reports</span>
    </Button>
  </Link>

  {/* Create Transaction Button */}
  <Link href="/transaction/create">
    <Button
      className={`
        px-2 md:px-4 py-2
        bg-transparent md:bg-green-600
        text-green-600 md:text-white
        hover:bg-transparent md:hover:bg-green-600
        hover:text-green-600 md:hover:text-black
        flex items-center gap-2
        border-none shadow-none
        transition-none md:transition-colors
      `}
    >
      <PenBox
        size={20}
        className="text-green-600 md:text-white md:hover:text-black"
      />
      <span className="hidden md:inline">Add Transaction</span>
    </Button>
  </Link>
</SignedIn>


          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className="gradient text-white" variant="outline">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default header;
