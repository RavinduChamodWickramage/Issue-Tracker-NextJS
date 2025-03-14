"use client";

import { Avatar, DropdownMenu, Text } from "@radix-ui/themes";
import { signOut } from "next-auth/react";

interface User {
  name?: string;
  email?: string;
}

const UserMenu = ({ user }: { user: User }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="bg-transparent border-none p-0 m-0">
          <Avatar
            fallback={user.name ? user.name.charAt(0).toUpperCase() : "U"}
            size="2"
            radius="full"
            className="cursor-pointer bg-white text-green-500"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={5}>
        {user.email && (
          <DropdownMenu.Label>
            <Text weight="bold">{user.email}</Text>
          </DropdownMenu.Label>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer"
        >
          Log Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
