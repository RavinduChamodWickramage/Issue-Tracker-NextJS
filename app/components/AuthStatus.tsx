"use client";

import { useSession } from "next-auth/react";
import { Button, Skeleton } from "@radix-ui/themes";
import Link from "next/link";
import UserMenu from "./UserMenu";

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;

  return (
    <div className="flex items-center gap-4">
      {status === "authenticated" && <UserMenu user={session.user} />}
      {status === "unauthenticated" && (
        <div className="flex gap-2">
          <Link href="/login" className="nav-link">
            <Button className="!bg-green-500 hover:!bg-white hover:!text-green-500">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="!bg-blue-500 hover:!bg-white hover:!text-blue-500">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
