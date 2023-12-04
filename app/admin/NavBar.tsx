"use client";
import { Admin } from "@prisma/client";
import {
  Avatar,
  Container,
  Flex,
  Heading,
  HoverCard,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import GoBack from "../components/GoBack";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import checkAdminAuth from "./helpers/check-auth";
const NavBar = () => {
  checkAdminAuth();

  const [adminUser, setAdminUser] = useState<Admin>();

  const { status, data } = useSession();

  const getAdminUser = async () => {
    if (data?.user.id) {
      const res = await axios.get("/api/admin/" + data?.user.id);
      setAdminUser(res.data.data);
    }
  };

  useEffect(() => {
    getAdminUser();
  }, [data]);

  return (
    <Flex
      className="bg-white border rounded-lg shadow-md h-[75px] mr-5 px-4"
      justify={"between"}
      align={"center"}
    >
      <GoBack />
      <Flex gap={"3"}>
        <Flex direction={"column"} justify={"end"} align={"end"}>
          <Heading size={"2"}>{adminUser?.name}</Heading>
          <Text size="1" className="text-xs text-slate-500">
            Admin
          </Text>
        </Flex>

        <HoverCard.Root>
          <HoverCard.Trigger>
            <Flex>
              <Avatar
                fallback={adminUser?.name[0] || "?"}
                radius="full"
                className="cursor-pointer"
              />
            </Flex>
          </HoverCard.Trigger>
          <HoverCard.Content className="p-0">
            <Flex
              gap={"2"}
              align={"center"}
              className="cursor-pointer hover:bg-[var(--violet-a3)] px-5 py-1 rounded-lg hover:text-[var(--violet-a11)]"
            >
              <GearIcon />
              <Text>Settings</Text>
            </Flex>
            <Flex
              gap={"2"}
              align={"center"}
              className="cursor-pointer hover:bg-[var(--violet-a3)] px-5 py-1 rounded-lg hover:text-[var(--violet-a11)]"
            >
              <PersonIcon />
              <Text>Profile</Text>
            </Flex>
            <Flex
              gap={"2"}
              align={"center"}
              className="cursor-pointer hover:bg-[var(--violet-a3)] px-5 py-1 rounded-lg hover:text-[var(--violet-a11)]"
              onClick={() => signOut()}
            >
              <IoLogOutOutline />
              <Text>Logout</Text>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
      </Flex>
    </Flex>
  );
};

export default NavBar;
