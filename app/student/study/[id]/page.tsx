"use client";
import PdfViewer from "@/app/components/PdfViewer";
import { CompletedTopics, Topic } from "@prisma/client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Callout, Flex, Heading, Text } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  params: {
    id: string;
  };
}

const StudyPage = ({ params }: Props) => {
  const [topic, setTopic] = useState<Topic>();
  const [isComplete, setComplete] = useState(false);
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  const getTopic = async () => {
    const res = await axios.get("/api/topic/" + params.id);

    const responseTopic = res.data.data;
    setTopic(responseTopic);

    const isCompleted = responseTopic.students_completed_topic.find(
      (student: CompletedTopics) => student.student_id === data?.user.id
    );

    if (isCompleted) {
      setComplete(true);
    }
  };

  const { data } = useSession();
  const markComplete = async () => {
    const res = await axios.post("/api/topic/" + params.id, {
      studentId: data?.user.id,
    });

    if (res.data.status) {
      setComplete(true);
      toast.success("Topic Marked as Complete.");
      router.back();
    }
  };

  const markIncomplete = async () => {
    const res = await axios.delete("/api/topic/" + params.id, {
      params: {
        student_id: data?.user.id,
      },
    });

    if (res.data.status) {
      setComplete(false);
      toast.success("Topic Marked as Incomplete.");
    }
  };

  useEffect(() => {
    getTopic();
  }, []);

  return (
    <Flex
      className="w-full h-[90vh] px-10 overflow-hidden overflow-y-scroll p-10"
      direction={"column"}
      pt={"6"}
      gap={"4"}
    >
      {isComplete && (
        <Callout.Root>
          <Flex className="w-[60vw]" justify={"between"} align={"center"}>
            <Flex gap={"2"}>
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>

              <Callout.Text>You have completed this topic.</Callout.Text>
            </Flex>
            <Button onClick={markIncomplete}>Mark as Incomplete</Button>
          </Flex>
        </Callout.Root>
      )}
      <Heading align={"center"} mb={"6"} my={"6"}>
        {topic?.name}
      </Heading>
      {topic?.video && (
        <Flex
          className="border shadow-lg rounded-lg bg-white w-full p-5"
          gap={"4"}
          direction={"column"}
        >
          <Flex justify={"between"}>
            <Heading size={"3"}>Video</Heading>
            {!showVideo ? (
              <Flex
                className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
                align={"center"}
                justify={"center"}
              >
                <ChevronDownIcon onClick={() => setShowVideo(true)} />
              </Flex>
            ) : (
              <Flex
                className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
                align={"center"}
                justify={"center"}
              >
                <ChevronUpIcon onClick={() => setShowVideo(false)} />
              </Flex>
            )}
          </Flex>

          {showVideo && (
            <video
              src={topic.video}
              controls
              className="rounded-lg w-full h-full"
            />
          )}
        </Flex>
      )}

      {topic?.pdf && (
        <Flex
          className="shadow-lg rounded-lg bg-white w-full p-5 border"
          direction={"column"}
          gap={"4"}
        >
          <Flex justify={"between"}>
            <Heading size={"3"}>PDF</Heading>
            {!showPDF ? (
              <Flex
                className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
                align={"center"}
                justify={"center"}
              >
                <ChevronDownIcon onClick={() => setShowPDF(true)} />
              </Flex>
            ) : (
              <Flex
                className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
                align={"center"}
                justify={"center"}
              >
                <ChevronUpIcon onClick={() => setShowPDF(false)} />
              </Flex>
            )}
          </Flex>
          {showPDF && <PdfViewer fileUrl={topic.pdf} />}
        </Flex>
      )}
      {/* {topic?.pdf && (
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
      )} */}
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
      {!isComplete && (
        <Flex justify={"end"} onClick={markComplete}>
          <Button>Mark as Completed</Button>
        </Flex>
      )}
    </Flex>
  );
};

export default StudyPage;
