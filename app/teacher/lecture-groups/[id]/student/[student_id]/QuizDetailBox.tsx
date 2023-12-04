import ScorePercentage from "@/app/components/ScorePercentage";
import { Topic } from "@prisma/client";
import { Badge, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface StudentsCompletedTopic {
  student_id: number;
  topic_id: number;
}

interface Props {
  topic: Topic & { students_completed_topic: StudentsCompletedTopic[] };
  studentId: Number;
}

interface QuizAttempts {
  score: number;
  created_at: string;
}

const QuizDetailBox = ({ topic, studentId }: Props) => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempts[]>([]);
  const [growth, setGrowth] = useState<number | null>();
  const [studentsCompleted, setStudentsCompleted] = useState<number[]>();

  const getQuizAttempts = async () => {
    const res = await axios.get("/api/quiz/submitted", {
      params: {
        topicId: topic.id,
        studentId: studentId,
      },
    });

    const quizAttempts = res.data.data;

    if (quizAttempts.length === 0) setGrowth(null);
    if (quizAttempts.length === 1) setGrowth(quizAttempts[0].score);
    if (quizAttempts.length > 1) {
      setGrowth(
        quizAttempts[quizAttempts.length - 1].score - quizAttempts[0].score
      );
    }

    let students_completed = topic.students_completed_topic.map(
      (student) => student.student_id
    );

    setStudentsCompleted([...students_completed]);

    setQuizAttempts(quizAttempts);
  };

  useEffect(() => {
    getQuizAttempts();
  }, []);

  return (
    <Flex
      direction={"column"}
      className="h-full border bg-white py-5 px-5 shadow-lg rounded-lg min-w-[400px] overflow-hidden overflow-y-scroll"
    >
      <Flex mb={"1"} justify={"center"}>
        {studentsCompleted?.includes(37) ? (
          <Badge className="w-fit" color="blue" size={"1"} radius="full">
            Complete
          </Badge>
        ) : (
          <Badge className="w-fit" color="red" size={"1"} radius="full">
            Incomplete
          </Badge>
        )}
      </Flex>
      <Flex align={"center"} justify={"between"} gap={"5"} mb={"5"}>
        <Heading size={"2"} className="min-w-fit">
          {topic.name}
        </Heading>
        {growth !== null && (
          <ScorePercentage
            outOf={100}
            score={growth ? growth : 0}
            prefix={growth && growth > 0 ? "+" : ""}
          />
        )}
      </Flex>

      {quizAttempts.length !== 0 ? (
        quizAttempts.map((quizAttempt, index) => (
          <Flex className="w-full" mb={"4"} key={index}>
            <Text className="text-xs text-slate-500 w-1/3">
              Attempt {index + 1}
            </Text>
            <Text className="text-xs text-slate-500 w-1/3 text-center">
              {moment(quizAttempt.created_at).format("DD MMM YYYY")}
            </Text>
            <Flex className="w-1/3" justify={"end"}>
              <ScorePercentage outOf={100} score={quizAttempt.score} />
            </Flex>
          </Flex>
        ))
      ) : (
        <Text className="text-xs text-slate-500">No Quiz Attempted.</Text>
      )}

      {/* <Flex justify={"between"} className="w-full" mb={"4"}>
        <Text className="text-xs text-slate-500">Attempt 1</Text>
        <ScorePercentage outOf={100} score={50} />
      </Flex>
      <Flex justify={"between"} className="w-full" mb={"4"}>
        <Text className="text-xs text-slate-500">Attempt 2</Text>
        <ScorePercentage outOf={100} score={90} />
      </Flex>
      <Flex justify={"between"} className="w-full">
        <Text className="text-xs text-slate-500">Attempt 2</Text>
        <ScorePercentage outOf={100} score={90} />
      </Flex> */}
    </Flex>
  );
};

export default QuizDetailBox;
