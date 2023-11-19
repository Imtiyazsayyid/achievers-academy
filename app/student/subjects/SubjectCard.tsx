"use client";
import {
  Box,
  Card,
  Flex,
  Heading,
  Inset,
  Strong,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  id: number;
  img: string;
  subject: string;
}

const SubjectCard = ({ img, subject, id }: Props) => {
  const router = useRouter();

  return (
    <Box
      className="h-48 bg-black rounded-lg overflow-hidden relative cursor-pointer"
      onClick={() => router.push(`/student/subjects/${id}`)}
    >
      <img
        src={img}
        className="opacity-30 object-cover bg-black h-full w-full hover:opacity-60 transition-all"
      />

      <Heading className="text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {subject}
      </Heading>
    </Box>
  );
};

export default SubjectCard;
