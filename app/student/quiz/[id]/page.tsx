"use client";
import ScorePercentage from "@/app/components/ScorePercentage";
import StatusBadge from "@/app/components/StatusBadge";
import { QuizQuestion, QuizQuestionOption, Topic } from "@prisma/client";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Callout,
  Flex,
  Grid,
  Heading,
  RadioGroup,
  Text,
  TextArea,
} from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  params: {
    id: string;
  };
}

type DetailedQuestion = QuizQuestion & {
  options: QuizQuestionOption[];
};

const QuizPage = ({ params }: Props) => {
  const { data } = useSession();

  const [quizQuestions, setQuizQuestions] = useState<DetailedQuestion[]>();
  const [isSubmitted, setSubmitted] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<
    { id: number; answer: string; isCorrect: boolean }[]
  >([]);
  const [topic, setTopic] = useState<Topic>();

  const getTopic = async () => {
    const res = await axios.get("/api/topic/" + params.id);
  };

  const getAllQuestions = async () => {
    const res = await axios.get("/api/quiz", {
      params: {
        topicId: params.id,
      },
    });
    setQuizQuestions(res.data.data);
    getAnswerStates(res.data.data);
  };

  const getQuizAttempts = async () => {
    const res = await axios.get("/api/quiz/submitted", {
      params: {
        topicId: params.id,
        studentId: data?.user.id,
      },
    });

    setQuizAttempts(res.data.count);
  };

  const getAnswerStates = (questions: QuizQuestion[]) => {
    let answer_array = [];
    for (let question of questions) {
      answer_array.push({ id: question.id, answer: "", isCorrect: false });
    }
    setQuizAnswers(answer_array);
  };

  const handleAnswerChange = (
    value: string,
    questionId: number,
    isCorrectAnswer: boolean
  ) => {
    const filteredAnswers = quizAnswers.map((answer) => {
      if (questionId == answer.id) {
        return {
          id: questionId,
          answer: value,
          isCorrect: isCorrectAnswer,
        };
      }
      return answer;
    });

    setQuizAnswers(filteredAnswers);
  };

  const getCorrectAnswerCount = () => {
    let score = 0;
    for (let answer of quizAnswers) {
      if (answer.isCorrect) {
        score++;
      }
    }
    return score;
  };

  const handleReset = () => {
    location.reload();
  };

  const router = useRouter();

  const handleSubmit = async () => {
    setSubmitted(true);
    const res = await axios.post("/api/quiz/submitted", {
      topicId: params.id,
      studentId: data?.user.id,
      score: (getCorrectAnswerCount() / quizAnswers.length) * 100,
    });

    if (res.data.status) {
      toast.success("Quiz Attempt Recorded");

      const res = await axios.post("/api/notification", {
        title: "Quiz Submitted",
        description: `${data?.user.name} has submitted ${topic?.name} Quiz`,
        to_teacher: 7,
      });
    }
  };

  useEffect(() => {
    getTopic();
    getAllQuestions();
    getQuizAttempts();
  }, [data?.user.id]);

  return (
    <Flex className="w-full h-full p-10">
      <Flex className="w-full bg-white rounded-lg p-10" direction={"column"}>
        <Heading mb={"5"} align={"center"}>
          {topic?.name} Quiz
        </Heading>
        <Flex
          className="border h-[60vh] rounded-lg bg-slate-100 p-4 overflow-hidden overflow-y-scroll"
          gap={"4"}
          direction={"column"}
        >
          <Callout.Root>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              Please note that every attempt of this quiz is recorded. You have
              Attempted this Quiz {quizAttempts} times.
            </Callout.Text>
          </Callout.Root>
          {isSubmitted && (
            <Flex justify={"end"}>
              <Flex className="h-fit border bg-white w-fit rounded-lg shadow-sm p-1">
                <ScorePercentage
                  score={getCorrectAnswerCount()}
                  outOf={quizQuestions?.length || 0}
                />
              </Flex>
            </Flex>
          )}
          {quizQuestions?.map((question, index) => (
            <Flex
              className="h-fit border bg-white w-full rounded-lg shadow-sm p-5"
              gap={"4"}
              direction={"column"}
              key={question.id}
            >
              <Text className="text-xs text-slate-500">
                Question {index + 1}
              </Text>
              {isSubmitted && (
                <Badge
                  className="w-fit"
                  color={
                    quizAnswers.find((answer) => answer.id === question.id)
                      ?.isCorrect
                      ? "green"
                      : "crimson"
                  }
                >
                  {quizAnswers.find((answer) => answer.id === question.id)
                    ?.isCorrect
                    ? "Correct"
                    : "Incorrect"}
                </Badge>
              )}
              <Text className="">{question.question}</Text>
              {question.type == "LONG_ANSWER" && (
                <Box>
                  <TextArea
                    disabled={isSubmitted}
                    className="h-40"
                    onChange={(e) =>
                      handleAnswerChange(
                        e.target.value,
                        question.id,
                        e.target.value === question.correctAnswer
                      )
                    }
                  />
                  {isSubmitted && (
                    <Text className="text-xs  text-slate-500">
                      Correct answer:{" "}
                      <span className=" text-green-700">
                        {question.correctAnswer}
                      </span>
                    </Text>
                  )}
                </Box>
              )}
              {question.type == "MULTIPLE_CHOICE" && (
                <Box>
                  <RadioGroup.Root
                    disabled={isSubmitted}
                    mb={"2"}
                    onValueChange={(value) =>
                      handleAnswerChange(
                        value,
                        question.id,
                        value === question.correctOption?.toString()
                      )
                    }
                  >
                    <Flex gap="2" direction="column">
                      {question.options.map((option) => (
                        <Text as="label" size="2" key={option.id}>
                          <Flex gap="2">
                            <RadioGroup.Item
                              value={option.option_number.toString()}
                            />{" "}
                            {option.text}
                          </Flex>
                        </Text>
                      ))}
                    </Flex>
                  </RadioGroup.Root>
                  {isSubmitted && (
                    <Text className="text-xs text-slate-500">
                      Correct answer:
                      <span className=" text-green-700">
                        {" "}
                        Option {question.correctOption}{" "}
                      </span>
                    </Text>
                  )}
                </Box>
              )}
            </Flex>
          ))}
        </Flex>
        <Flex p={"2"} justify={"end"} gap={"2"}>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="soft">Reset</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
              <AlertDialog.Title>Reset Quiz</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure you want to retake this test.
                <br /> Your Current Progress will be lost
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" onClick={handleReset}>
                    Reset
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <Button variant="soft" color="green" onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default QuizPage;
