import { Container, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { GiPirateHook } from "react-icons/gi";

const Links = [
  { label: "Boards", link: "/admin/boards" },
  { label: "Grades", link: "/admin/grades" },
  { label: "Subjects", link: "/admin/subjects" },
];

const NavBar = () => {
  return (
    <Flex className="h-14 border-b">
      <Container>
        <Flex className="h-14 border-b">
          <Flex className="w-1/5" align={"center"} justify={"center"}></Flex>
          <Flex className="w-3/5" align={"center"} justify={"center"} gap={"9"}>
            {Links.map(({ label, link }) => (
              <Link href={link} className="hover:text-[var(--violet-a11)]">
                {label}
              </Link>
            ))}
          </Flex>
          <Flex className="w-1/5"></Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default NavBar;
