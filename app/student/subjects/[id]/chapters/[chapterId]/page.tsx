"use client";
import SearchBar from "@/app/components/SearchBar";
import { Topic } from "@prisma/client";
import { Avatar, Button, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
    chapterId: string;
  };
}

const TopicsPage = ({ params }: Props) => {
  const [topics, setTopics] = useState<Topic[]>();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const getAllTopics = async () => {
    const res = await axios.get("/api/topic", {
      params: {
        chapterId: params.chapterId,
        searchText,
      },
    });

    setTopics(res.data.data);
  };

  useEffect(() => {
    getAllTopics();
  }, [searchText]);

  return (
    <Flex className="w-full h-full p-10">
      <Flex
        className="border w-full bg-white rounded-lg shadow-sm p-10"
        direction={"column"}
      >
        <Heading mb={"7"}>Your Topics</Heading>
        <Flex mb={"2"}>
          <SearchBar
            placeholder="Find Your Subject"
            searchText={searchText}
            setSearchText={(text) => setSearchText(text)}
          />
        </Flex>

        <Flex className="border h-[60vh] rounded-lg bg-slate-100 p-4" gap={"4"}>
          {topics?.map((topic) => (
            <Flex
              className="border h-16 w-full shadow-lg rounded-lg bg-white p-3"
              key={topic.id}
              align={"center"}
            >
              <Flex align={"center"} gap={"3"} className="w-1/2">
                <Avatar fallback={topic.name[0]} />
                <Heading size={"2"}>{topic.name}</Heading>
              </Flex>
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
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TopicsPage;
