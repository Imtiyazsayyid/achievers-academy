import { Board, Grade, LectureGroup, Subject, Teacher } from "@prisma/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HoverCard,
  Link,
  Text,
} from "@radix-ui/themes";
import React from "react";

type DetailedLectureGroup = LectureGroup & {
  subject: Subject & {
    board: Board;
    grade: Grade;
  };
  teacher: Teacher;
};

interface Props {
  lectureGroups: string[];
}

const LectureGroupsHoverCard = ({ lectureGroups }: Props) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Text className="cursor-pointer" color="violet">
          Lecture Groups
        </Text>
      </HoverCard.Trigger>
      <HoverCard.Content>
        {lectureGroups.length === 0 && (
          <p className="text-xs">No Lecture Groups Assigned</p>
        )}
        {lectureGroups.map((lectureGroup, index) => (
          <Flex className="mb-1 border p-2 rounded-lg" key={index}>
            <Text className="text-xs">{lectureGroup}</Text>
          </Flex>
        ))}
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export default LectureGroupsHoverCard;
