"use client";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaBookOpenReader } from "react-icons/fa6";
import { PiMedalFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";

const Links = [
  {
    label: "Boards",
    link: "/admin/boards",
    icon: <RiGraduationCapFill className="text-xl " />,
  },
  {
    label: "Grades",
    link: "/admin/grades",
    icon: <PiMedalFill className="text-xl " />,
  },
  {
    label: "Subjects",
    link: "/admin/subjects",
    icon: <FaBookOpenReader className="text-lg " />,
  },
  {
    label: "Students",
    link: "/admin/students",
    icon: <FaUser className="text-lg " />,
  },
  {
    label: "Teachers",
    link: "/admin/teachers",
    icon: <PiChalkboardTeacherFill className="text-xl " />,
  },
  {
    label: "Lecture Groups",
    link: "/admin/lecture-groups",
    icon: <FaUsers className="text-2xl" />,
  },
];

const VerticalNavBar = () => {
  //   return <Button>Open SideBar</Button>;
  const handleClick = (link: string) => {
    router.push(link);
  };

  const currentPathName = usePathname();

  const router = useRouter();
  return (
    <Flex className="w-[25%] p-5">
      <Flex
        className=" bg-white border shadow-lg rounded-lg w-full p-5"
        direction={"column"}
      >
        <Heading className="pt-2 pr-5 pl-5 " mt={"2"} mb={"6"}>
          Achiever's Academy
        </Heading>
        {Links.map(({ link, label, icon }) => (
          <Flex
            key={link}
            onClick={() => handleClick(link)}
            className={`h-16 rounded-none hover:shadow-lg pl-5 hover:rounded-xl cursor-pointer ${
              currentPathName === link &&
              "bg-[var(--violet-a11)] text-white rounded-xl"
            }`}
            align={"center"}
          >
            <Flex className="w-5 mr-3">{icon}</Flex>
            <Text>{label}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default VerticalNavBar;
