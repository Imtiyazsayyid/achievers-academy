"use client";
import { Button, Container, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { GiPirateHook } from "react-icons/gi";
import checkStudentAuth from "./helpers/check-auth";
import { signOut } from "next-auth/react";

const Links = [{ label: "Subjects", link: "/student/subjects" }];

const NavBar = () => {
  checkStudentAuth();
  return (
    <Flex className="h-14 border-b bg-white">
      <Container>
        <Flex className="h-14 border-b">
          <Flex className="w-1/5" align={"center"} justify={"center"}></Flex>
          <Flex className="w-3/5" align={"center"} justify={"center"} gap={"9"}>
            {Links.map(({ label, link }) => (
              <Link
                href={link}
                className="hover:text-[var(--violet-a11)]"
                key={link}
              >
                {label}
              </Link>
            ))}
          </Flex>
          <Flex className="w-1/5" align={"center"}>
            <Button onClick={() => signOut()}>Log out</Button>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default NavBar;
