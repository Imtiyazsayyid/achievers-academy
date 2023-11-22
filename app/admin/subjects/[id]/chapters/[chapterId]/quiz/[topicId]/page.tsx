"use client";
import GoBack from "@/app/components/GoBack";
import { Flex, Heading } from "@radix-ui/themes";
import React from "react";
import QuizInput from "../../components/QuizInput";

interface Props {
  params: {
    topicId: string;
  };
}

const page = ({ params }: Props) => {
  return (
    <Flex className="w-full min-h-full py-20">
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-[full] w-full"
      >
        <GoBack />
        <Heading mt={"5"} mb={"4"}>
          Quiz
        </Heading>
        <QuizInput topicId={params.topicId} />
      </Flex>
    </Flex>
  );
};

export default page;
