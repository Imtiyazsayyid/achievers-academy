"use client";
import GoBack from "@/app/components/GoBack";
import { Flex, Heading } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import QuizInput from "../../components/QuizInput";
import axios from "axios";
import { Topic } from "@prisma/client";

interface Props {
  params: {
    chapterId: string;
    topicId: string;
  };
}

const page = ({ params }: Props) => {
  const [topic, setTopic] = useState<Topic>();

  const getTopic = async () => {
    const res = await axios.get("/api/topic", {
      params: {
        chapterId: params.chapterId,
        topicId: params.topicId,
      },
    });

    setTopic(res.data.data[0]);
  };

  useEffect(() => {
    getTopic();
  }, []);

  return (
    <Flex className="w-full min-h-full py-5">
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-[full] w-full"
      >
        <Heading mt={"5"} mb={"4"}>
          {topic?.name} Quiz
        </Heading>
        <QuizInput topicId={params.topicId} />
      </Flex>
    </Flex>
  );
};

export default page;
