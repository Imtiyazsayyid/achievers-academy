"use client";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegBell } from "react-icons/fa6";

interface Props {
  isNew: boolean;
}

const Notification = ({ isNew }: Props) => {
  const router = useRouter();

  return (
    <Flex
      className="shadow-md border p-2 rounded-full cursor-pointer"
      onClick={() => router.push("/teacher/notifications")}
    >
      <FaRegBell className="text-xl text-slate-500" />
      {isNew && <div className="bg-red-300 h-2 w-2 rounded-full"></div>}
    </Flex>
  );
};

export default Notification;
