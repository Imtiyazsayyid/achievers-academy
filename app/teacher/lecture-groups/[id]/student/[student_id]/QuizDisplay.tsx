import ScorePercentage from "@/app/components/ScorePercentage";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Box, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import QuizDetailBox from "./QuizDetailBox";
import { Chapter, Topic } from "@prisma/client";

interface StudentsCompletedTopic {
  student_id: number;
  topic_id: number;
}

type DetailedTopic = Topic & {
  students_completed_topic: StudentsCompletedTopic[];
};

interface Props {
  chapter: Chapter & {
    topics: DetailedTopic[];
  };
}

const QuizDisplay = ({ chapter }: Props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Flex
      direction={"column"}
      gap="2"
      className="w-[60vw] border p-5 rounded-lg"
    >
      <Flex justify={"between"} align={"center"}>
        <Heading size="3">{chapter.name}</Heading>
        {!showDetails ? (
          <Flex
            className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
            align={"center"}
            justify={"center"}
          >
            <ChevronDownIcon onClick={() => setShowDetails(true)} />
          </Flex>
        ) : (
          <Flex
            className="border shadow-md rounded-full h-5 w-5 cursor-pointer"
            align={"center"}
            justify={"center"}
          >
            <ChevronUpIcon onClick={() => setShowDetails(false)} />
          </Flex>
        )}
      </Flex>
      {showDetails && (
        <Flex
          gap={"2"}
          className="h-60 minoverflow-hidden overflow-x-scroll p-2 rounded-lg w-full border bg-slate-50 mt-2"
        >
          {chapter.topics.map((topic) => (
            <QuizDetailBox topic={topic} key={topic.id} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default QuizDisplay;
