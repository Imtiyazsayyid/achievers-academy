"use client";
import { Admin } from "@prisma/client";
import {
  Avatar,
  Container,
  DropdownMenu,
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

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Flex>
              <Avatar
                fallback={adminUser?.name[0] || "?"}
                radius="full"
                className="cursor-pointer"
              />
            </Flex>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Flex gap={"2"} align={"center"}>
                <GearIcon /> Settings
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex gap={"2"} align={"center"}>
                <PersonIcon /> Profile
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => signOut()}>
              <Flex gap={"2"} align={"center"}>
                <IoLogOutOutline /> Logout
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
};

export default NavBar;
