"use client";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaBookOpenReader } from "react-icons/fa6";
import { PiMedalFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons";

const Links = [
  {
    label: "Home",
    link: "/teacher",
    icon: <IoHome className="text-xl " />,
  },
  // {
  //   label: "Subjects",
  //   link: "/teacher/subjects",
  //   icon: <FaBookOpenReader className="text-lg " />,
  // },
  // {
  //   label: "Students",
  //   link: "/teacher/students",
  //   icon: <FaUser className="text-lg " />,
  // },
  {
    label: "Lecture Groups",
    link: "/teacher/lecture-groups",
    icon: <FaUsers className="text-2xl" />,
  },
];

const VerticalNavBar = () => {
  const [isActive, setActive] = useState(true);

  if (!isActive)
    return (
      <Flex
        className="fixed top-5 left-[-25px] bg-[var(--violet-a11)] w-10 h-16 rounded-lg shadow-md pr-1 cursor-pointer"
        onClick={() => setActive(true)}
      ></Flex>
    );
  const handleClick = (link: string) => {
    router.push(link);
  };

  const currentPathName = usePathname();

  const router = useRouter();
  return (
    <Flex className="w-[25%] py-5 pl-5">
      <Cross1Icon
        className="relative left-[90%] top-5 cursor-pointer"
        onClick={() => setActive(false)}
      />
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
            className={`h-16 rounded-none hover:shadow-md pl-5 hover:rounded-xl cursor-pointer ${
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
