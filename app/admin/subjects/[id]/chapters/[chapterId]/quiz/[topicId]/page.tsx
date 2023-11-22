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
    <Flex className="min-h-[90vh] w-full">
      <Flex
        direction={"column"}
        my={"9"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
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
