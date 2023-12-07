"use client";
import { Admin } from "@prisma/client";
import {
  Avatar,
  Button,
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
import { BellIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { IoLogOutOutline } from "react-icons/io5";
import checkTeacherAuth from "./helpers/check-auth";
import { signOut, useSession } from "next-auth/react";
import { FaRegBell } from "react-icons/fa";
import Notification from "../components/Notification";

const NavBar = () => {
  checkTeacherAuth();

  const [teacher, setTeacher] = useState<Admin>();

  const { status, data } = useSession();

  const getTeacher = async () => {
    if (data?.user.id) {
      const res = await axios.get("/api/teacher/" + data?.user.id);
      setTeacher(res.data.data);
    }
  };

  useEffect(() => {
    getTeacher();
  }, [data]);

  return (
    <Flex
      className="bg-white border rounded-lg shadow-md h-[75px] mr-5 px-4"
      justify={"between"}
      align={"center"}
    >
      <GoBack />
      <Flex align={"center"} gap={"5"}>
        <Notification isNew={true} />
        <Flex gap={"3"}>
          <Flex direction={"column"} justify={"end"} align={"end"}>
            <Heading size={"2"}>{teacher?.name}</Heading>
            <Text size="1" className="text-xs text-slate-500">
              Teacher
            </Text>
          </Flex>

          {/* <HoverCard.Root>
          <HoverCard.Trigger>
            <Flex>
              <Avatar
                fallback={teacher?.name[0] || "?"}
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
        </HoverCard.Root> */}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Flex>
                <Avatar
                  fallback={teacher?.name[0] || "?"}
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
    </Flex>
  );
};

export default NavBar;
