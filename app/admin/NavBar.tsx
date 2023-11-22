import { Container, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { GiPirateHook } from "react-icons/gi";

const Links = [
  { label: "Boards", link: "/admin/boards" },
  { label: "Grades", link: "/admin/grades" },
  { label: "Subjects", link: "/admin/subjects" },
  { label: "Students", link: "/admin/students" },
  { label: "Teachers", link: "/admin/teachers" },
  { label: "Lecture Groups", link: "/admin/lecture-groups" },
];

const NavBar = () => {
  return (
    <Flex className="h-14 border-b bg-white">
      <Container>
        <Flex className="h-14 border-b">
          {/* <Flex className="w-1/6" align={"center"} justify={"center"}></Flex> */}
          <Flex
            className="w-full"
            align={"center"}
            justify={"center"}
            gap={"9"}
          >
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
          {/* <Flex className="w-1/6"></Flex> */}
        </Flex>
      </Container>
    </Flex>
  );
};

export default NavBar;
