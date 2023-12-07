"use client";
import SearchBar from "@/app/components/SearchBar";
import { Chapter, Topic } from "@prisma/client";
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
    chapterId: string;
  };
}

interface StudentsCompletedTopic {
  student_id: number;
  topic_id: number;
}

type DetailedTopic = Topic & {
  students_completed_topic: StudentsCompletedTopic[];
};

const TopicsPage = ({ params }: Props) => {
  const [topics, setTopics] = useState<DetailedTopic[]>();
  const [searchText, setSearchText] = useState("");
  const [chapter, setChapter] = useState<Chapter>();
  const router = useRouter();

  const getChapter = async () => {
    const res = await axios.get("/api/chapter", {
      params: {
        chapterId: params.chapterId,
        subjectId: params.id,
      },
    });

    setChapter(res.data.data[0]);
  };

  const getAllTopics = async () => {
    const res = await axios.get("/api/topic", {
      params: {
        chapterId: params.chapterId,
        searchText,
      },
    });

    setTopics(res.data.data);
  };

  const { status, data } = useSession();

  useEffect(() => {
    getAllTopics();
    getChapter();
  }, [searchText]);

  return (
    <Flex className="w-full h-full p-10">
      <Flex className=" w-full bg-white  p-10" direction={"column"}>
        <Heading mb={"7"}>{chapter?.name} Topics</Heading>
        <Flex mb={"2"}>
          <SearchBar
            placeholder="Find Topic"
            searchText={searchText}
            setSearchText={(text) => setSearchText(text)}
          />
        </Flex>

        <Flex
          className="border h-[60vh] rounded-lg bg-slate-100 p-4 overflow-hidden overflow-y-scroll"
          gap={"2"}
          direction={"column"}
        >
          {topics?.map((topic) => {
            let students_completed = topic.students_completed_topic?.map(
              (student) => student.student_id
            );
            return (
              <Flex
                className="border h-16 w-full shadow-lg rounded-lg bg-white p-3"
                key={topic.id}
                align={"center"}
              >
                <Flex align={"center"} gap={"3"} className="w-1/2">
                  <Avatar fallback={topic.name[0]} />
                  <Heading size={"2"}>{topic.name}</Heading>
                </Flex>
                {data?.user.id &&
                students_completed?.includes(data?.user.id) ? (
                  <Badge
                    className="w-fit"
                    color="blue"
                    size={"1"}
                    radius="full"
                  >
                    Complete
                  </Badge>
                ) : (
                  <Badge className="w-fit" color="red" size={"1"} radius="full">
                    Incomplete
                  </Badge>
                )}
                <Flex className="w-1/2" justify={"end"} gap={"2"}>
                  <Button
                    variant="soft"
                    color="green"
                    onClick={() => router.push(`/student/study/${topic.id}`)}
                  >
                    Study
                  </Button>
                  <Button
                    variant="soft"
                    onClick={() => router.push(`/student/quiz/${topic.id}`)}
                  >
                    Take Quiz
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TopicsPage;
