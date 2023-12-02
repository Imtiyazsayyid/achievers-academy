"use client";

import Pagination from "@/app/components/Pagination";
import SearchBar from "@/app/components/SearchBar";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  Chapter,
  Student,
  StudentLectureGroupMapper,
  Topic,
} from "@prisma/client";
import {
  ChevronDownIcon,
  Cross2Icon,
  EyeOpenIcon,
  RowSpacingIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, Table } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuizDisplay from "./QuizDisplay";
import QuizDetailBox from "./QuizDetailBox";

interface Props {
  params: {
    id: string;
    student_id: string;
  };
}

interface StudentsCompletedTopic {
  student_id: number;
  topic_id: number;
}

type DetailedTopic = Topic & {
  students_completed_topic: StudentsCompletedTopic[];
};

type DetailedChapter = Chapter & {
  topics: DetailedTopic[];
};

const LectureGroupView = ({ params }: Props) => {
  const [student, setStudent] = useState<Student>();
  const [topicIds, setTopicIds] = useState();
  const [chapters, setChapters] = useState<DetailedChapter[]>();

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

    setChapters(res.data.data[0].lecture_group.subject.chapters);
  };

  const getquizAttempDetails = async () => {};

  const router = useRouter();
  const [open, setOpen] = useState(false);

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
        <Flex
          className="h-[60vh] overflow-hidden overflow-y-scroll"
          direction={"column"}
          gap={"1"}
        >
          {chapters?.map((chapter) => (
            <QuizDisplay
              chapter={chapter}
              key={chapter.id}
              studentId={parseInt(params.student_id)}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LectureGroupView;
