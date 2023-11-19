"use client";
import PdfViewer from "@/app/components/PdfViewer";
import { Topic } from "@prisma/client";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

const StudyPage = ({ params }: Props) => {
  const [topic, setTopic] = useState<Topic>();

  const getTopic = async () => {
    const res = await axios.get("/api/topic/" + params.id);

    console.log(res.data.data);
    setTopic(res.data.data);
  };

  useEffect(() => {
    getTopic();
  }, []);

  return (
    <Flex className="w-full" direction={"column"} p={"7"} gap={"4"}>
      <Heading align={"center"} mb={"6"}>
        {topic?.name}
      </Heading>
      {topic?.video && (
        <Flex className="border shadow-lg rounded-lg bg-white w-full p-5">
          <video
            src={topic.video}
            controls
            className="rounded-lg w-full h-full"
          />
        </Flex>
      )}

      {/* <Box className="shadow-lg rounded-lg bg-white w-full p-5">
        <PdfViewer fileUrl="https://www.africau.edu/images/default/sample.pdf" />
      </Box> */}
      {topic?.pdf && (
        <Flex
          className="border shadow-lg rounded-lg bg-white w-full p-5"
          direction={"column"}
          key={topic.id}
        >
          <Heading size={"4"} mb={"3"}>
            Revision Mindmap
          </Heading>
          <Link href={topic.pdf} target="_blank">
            <Button className="w-fit" variant="soft">
              Open PDF
            </Button>
          </Link>
        </Flex>
      )}
      {topic?.description && (
        <Flex
          className="border shadow-lg rounded-lg bg-white w-full p-5"
          direction={"column"}
          key={topic.id}
        >
          <Heading size={"4"} mb={"3"}>
            Please Note
          </Heading>
          <Text className="text-xs text-slate-500 pr-20">
            {topic?.description}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default StudyPage;
