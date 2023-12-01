import { QuizQuestion, QuizQuestionOption } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  topicId: string;
}

type DetailedQuestion = QuizQuestion & {
  options: QuizQuestionOption[];
};

const QuizInput = ({ topicId }: Props) => {
  const router = useRouter();

  const [questions, setQuestions] = useState([
    {
      id: 0,
      question: "",
      type: "LONG_ANSWER",
      options: [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ],
      correctOption: 1,
      correctAnswer: "",
    },
  ]);

  const getAllQuestions = async () => {
    const res = await axios.get("/api/quiz", {
      params: {
        topicId,
      },
    });

    let quizQuestions = res.data.data;
    quizQuestions = quizQuestions.map(
      (question: DetailedQuestion, index: number) => {
        return {
          id: index + 1,
          question: question.question,
          type: question.type,
          options:
            question.options.length !== 0
              ? question.options.map((option, index) => {
                  return {
                    id: option.option_number,
                    text: option.text,
                  };
                })
              : [
                  { id: 1, text: "" },
                  { id: 2, text: "" },
                  { id: 3, text: "" },
                  { id: 4, text: "" },
                ],
          correctOption: question.correctOption,
          correctAnswer: question.correctAnswer,
        };
      }
    );

    setQuestions(quizQuestions);
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  const addEmptyQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        type: "LONG_ANSWER",
        options: [
          { id: 1, text: "" },
          { id: 2, text: "" },
          { id: 3, text: "" },
          { id: 4, text: "" },
        ],
        correctOption: 1,
        correctAnswer: "",
      },
    ]);
  };

  const changeQuestionType = (value: string, id: number) => {
    const filteredQuestions = questions.map((question) => {
      if (question.id == id) {
        return {
          id,
          question: question.question,
          type: value,
          options: question.options,
          correctOption: question.correctOption,
          correctAnswer: question.correctAnswer,
        };
      }
      return question;
    });

    setQuestions(filteredQuestions);
  };

  const changeQuestionCorrectOption = (value: string, id: number) => {
    const filteredQuestions = questions.map((question) => {
      if (question.id == id) {
        return {
          id,
          question: question.question,
          type: question.type,
          options: question.options,
          correctOption: parseInt(value),
          correctAnswer: question.correctAnswer,
        };
      }
      return question;
    });

    setQuestions(filteredQuestions);
  };

  const changeQuestionCorrectAnswer = (value: string, id: number) => {
    const filteredQuestions = questions.map((question) => {
      if (question.id == id) {
        return {
          id,
          question: question.question,
          type: question.type,
          options: question.options,
          correctOption: question.correctOption,
          correctAnswer: value,
        };
      }
      return question;
    });

    setQuestions(filteredQuestions);
  };

  const addQuestion = (value: string, id: number) => {
    const filteredQuestions = questions.map((question) => {
      if (question.id == id) {
        return {
          id,
          question: value,
          type: question.type,
          options: question.options,
          correctOption: question.correctOption,
          correctAnswer: question.correctAnswer,
        };
      }
      return question;
    });
    setQuestions(filteredQuestions);
  };

  const removeQuestion = (id: number) => {
    const filteredQuestions = questions.filter(
      (question) => question.id !== id
    );

    setQuestions(filteredQuestions);
  };

  const addOption = (questionId: number, optionId: number, value: string) => {
    const filteredQuestions = questions.map((question) => {
      if (questionId == question.id) {
        const filteredOptions = question.options.map((option) => {
          if (option.id == optionId) {
            return {
              id: optionId,
              text: value,
            };
          }
          return {
            id: option.id,
            text: option.text,
          };
        });

        question.options = filteredOptions;
      }
      return question;
    });

    setQuestions(filteredQuestions);
  };

  const handleSubmit = async () => {
    const res = await axios.post("/api/quiz", { questions, topicId });
    router.back();
  };

  return (
    <Flex
      className="border h-full mb-4 p-5 overflow-hidden overflow-y-scroll rounded-lg bg-slate-100"
      direction={"column"}
    >
      {questions.map((question, index) => (
        <Flex
          key={question.id}
          gap={"2"}
          direction={"column"}
          mt={"6"}
          className="shadow-lg w-100 border p-8 rounded-lg bg-white"
        >
          <Flex className="w-full" gap={"2"} align={"end"}>
            <Flex direction={"column"} gap={"2"} className="w-3/4">
              <Text size={"1"}>Question {index + 1}</Text>
              <TextField.Root>
                <TextField.Input
                  defaultValue={question.question}
                  onChange={(e) => addQuestion(e.target.value, question.id)}
                />
              </TextField.Root>
            </Flex>
            <Flex className="w-1/4" align={"end"} gap={"2"}>
              <Flex direction={"column"} gap={"2"}>
                <Text size={"1"}>Question Type</Text>
                <Select.Root
                  size="2"
                  defaultValue={question.type}
                  onValueChange={(value) =>
                    changeQuestionType(value, question.id)
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="LONG_ANSWER">Long Answer</Select.Item>
                    <Select.Item value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Button
                variant="soft"
                color="red"
                onClick={() => removeQuestion(question.id)}
              >
                <TrashIcon />
              </Button>
            </Flex>
          </Flex>
          {question.type == "MULTIPLE_CHOICE" && (
            <Flex className="w-3/4" gap={"2"}>
              <Flex direction={"column"} gap={"2"} className="w-1/4">
                <Text size={"1"}>Option 1</Text>
                <TextField.Root>
                  <TextField.Input
                    onChange={(e) => addOption(question.id, 1, e.target.value)}
                    defaultValue={question.options[0]?.text}
                  />
                </TextField.Root>
              </Flex>
              <Flex direction={"column"} gap={"2"} className="w-1/4">
                <Text size={"1"}>Option 2</Text>
                <TextField.Root>
                  <TextField.Input
                    onChange={(e) => addOption(question.id, 2, e.target.value)}
                    defaultValue={question.options[1]?.text}
                  />
                </TextField.Root>
              </Flex>
              <Flex direction={"column"} gap={"2"} className="w-1/4">
                <Text size={"1"}>Option 3</Text>
                <TextField.Root>
                  <TextField.Input
                    onChange={(e) => addOption(question.id, 3, e.target.value)}
                    defaultValue={question.options[2]?.text}
                  />
                </TextField.Root>
              </Flex>
              <Flex direction={"column"} gap={"2"} className="w-1/4">
                <Text size={"1"}>Option 4</Text>
                <TextField.Root>
                  <TextField.Input
                    onChange={(e) => addOption(question.id, 4, e.target.value)}
                    defaultValue={question.options[3]?.text}
                  />
                </TextField.Root>
              </Flex>
              <Flex direction={"column"} gap={"2"} className="w-1/4 mr-2">
                <Text size={"1"}>Correct Option</Text>
                <Select.Root
                  size="2"
                  onValueChange={(value) =>
                    changeQuestionCorrectOption(value, question.id)
                  }
                  defaultValue={question.correctOption?.toString() || undefined}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="1">Option 1</Select.Item>
                    <Select.Item value="2">Option 2</Select.Item>
                    <Select.Item value="3">Option 3</Select.Item>
                    <Select.Item value="4">Option 4</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          )}
          {question.type == "LONG_ANSWER" && (
            <Flex mr={"2"}>
              <TextArea
                className="w-3/4 h-40"
                onChange={(e) =>
                  changeQuestionCorrectAnswer(e.target.value, question.id)
                }
                defaultValue={question.correctAnswer}
              />
            </Flex>
          )}
        </Flex>
      ))}
      <Flex justify={"center"} gap={"2"} mt={"9"}>
        <Button color="green" variant="soft" onClick={addEmptyQuestion}>
          Add Question
        </Button>
        <Button variant="soft" onClick={handleSubmit}>
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

export default QuizInput;
