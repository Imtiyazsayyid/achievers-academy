"use client";
import { Admin } from "@prisma/client";
import { Avatar, Container, Flex, Heading, Text } from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import GoBack from "../components/GoBack";
const NavBar = () => {
  const [adminUser, setAdminUser] = useState<Admin>();

  const getAdminUser = async () => {
    const res = await axios.get("/api/admin/1");
    console.log(res);
    setAdminUser(res.data.data);
  };

  useEffect(() => {
    getAdminUser();
  });

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
        <Avatar fallback={adminUser?.name[0] || "?"} radius="full" />
      </Flex>
    </Flex>
  );
};

export default NavBar;
