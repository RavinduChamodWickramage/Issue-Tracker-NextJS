"use client";

import { Avatar, DropdownMenu, Text } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface User {
  name?: string;
  email?: string;
}

const UserMenu = ({ user }: { user: User }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar
          fallback={user.name ? user.name.charAt(0).toUpperCase() : "U"}
          size="2"
          radius="full"
          className="cursor-pointer"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>
          {user.email && <Text weight="bold">{user.email}</Text>}
          {user.name && <Text color="gray">{user.name}</Text>}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => signOut()}>Log Out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
