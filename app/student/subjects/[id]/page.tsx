"use client";
import SearchBar from "@/app/components/SearchBar";
import { Chapter, Topic } from "@prisma/client";
import { Avatar, Text, Button, Flex, Heading } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

type DetailedChapter = Chapter & {
  topics: Topic[];
};

const SubjectDetailPage = ({ params }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [chapters, setChapters] = useState<DetailedChapter[]>();
  const router = useRouter();

  const getAllChapters = async () => {
    const res = await axios.get("/api/chapter", {
      params: {
        subjectId: params.id,
      },
    });

    setChapters(res.data.data);
  };

  useEffect(() => {
    getAllChapters();
  }, []);

  return (
    <Flex className="w-full h-full p-10">
      <Flex
        className="border w-full bg-white rounded-lg shadow-sm p-10"
        direction={"column"}
      >
        <Heading mb={"7"}>Chapters</Heading>
        <Flex mb={"2"}>
          <SearchBar
            placeholder="Find Your Subject"
            searchText={searchText}
            setSearchText={(text) => setSearchText(text)}
          />
        </Flex>
        <Flex
          className="border h-[60vh] rounded-lg bg-slate-100 p-4 overflow-hidden overflow-y-scroll "
          direction={"column"}
          gap={"2"}
        >
          {chapters?.map((chapter) => (
            <Flex
              className="border h-16 w-full shadow-lg rounded-lg bg-white p-3"
              key={chapter.id}
              align={"center"}
            >
              <Flex align={"center"} gap={"3"} className="w-1/3">
                <Avatar fallback={chapter.name[0]} />
                <Heading size={"2"}>{chapter.name}</Heading>
              </Flex>
              <Flex className="w-1/3" justify={"center"}>
                <Text className="text-xs text-slate-500">
                  {chapter.topics.length} Topics
                </Text>
              </Flex>
              <Flex className="w-1/3" justify={"end"}>
                <Button
                  variant="soft"
                  onClick={() =>
                    router.push(
                      `/student/subjects/${params.id}/chapters/${chapter.id}`
                    )
                  }
                >
                  Study
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SubjectDetailPage;
