"use client";
import { Chapter, Student, Topic } from "@prisma/client";
import { Flex, Heading } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuizDisplay from "./QuizDisplay";
import { Props } from "./page";

export const LectureGroupView = ({ params }: Props) => {
  const [student, setStudent] = useState<Student>();
  const [topicIds, setTopicIds] = useState();

  const getStudent = async () => {
    const res = await axios.get("/api/student/", {
      params: {
        id: params.student_id,
      },
    });

    setStudent(res.data.data[0]);
  };

  const getLectureGroupDetails = async () => {
    const res = await axios.get("/api/student/lecture-group", {
      params: {
        lectureGroupId: params.id,
      },
    });

    const lectureGroupDetails = res.data.data[0];
    const topicIds = lectureGroupDetails.lecture_group.subject.chapters.map(
      (chapter: Chapter & { topics: Topic[] }) =>
        chapter.topics.map((topic) => topic.id)
    );

    if (topicIds.length !== 0) {
      const newRes = await axios.get("/api/quiz/submitted", {
        params: {
          topicIds: JSON.stringify(topicIds),
          studentId: 37,
        },
      });
    }
  };

  const getquizAttempDetails = async () => {};

  const router = useRouter();

  useEffect(() => {
    getStudent();
    getLectureGroupDetails();
    getquizAttempDetails();
  }, []);

  return (
    <Flex className="w-full h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mb={"6"} mt="5">
          {student?.name}'s Progress
        </Heading>
        <Collapsible.Root
          className="CollapsibleRoot"
          open={open}
          onOpenChange={setOpen}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="Text" style={{ color: "white" }}>
              @peduarte starred 3 repositories
            </span>
            <Collapsible.Trigger asChild>
              <button className="IconButton">
                {open ? <Cross2Icon /> : <RowSpacingIcon />}
              </button>
            </Collapsible.Trigger>
          </div>

          <div className="Repository">
            <span className="Text">@radix-ui/primitives</span>
          </div>

          <Collapsible.Content>
            <div className="Repository">
              <span className="Text">@radix-ui/colors</span>
            </div>
            <div className="Repository">
              <span className="Text">@stitches/react</span>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <Flex
          gap={"5"}
          className="w-[60vw] overflow-hidden overflow-x-scroll p-2 border rounded-lg"
        >
          <QuizDisplay />
          <QuizDisplay />
          <QuizDisplay />
          <QuizDisplay />
          <QuizDisplay />
          <QuizDisplay />
          <QuizDisplay />
        </Flex>
      </Flex>
    </Flex>
  );
};
