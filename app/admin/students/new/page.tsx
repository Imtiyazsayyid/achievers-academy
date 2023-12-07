"use client";
import GoBack from "@/app/components/GoBack";
import SearchBar from "@/app/components/SearchBar";
import { studentSchema } from "@/app/validationSchemas";
import { Board, Grade, LectureGroup, Student, Subject } from "@prisma/client";
import {
  Flex,
  Heading,
  TextField,
  Text,
  Select,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MultiSelect from "react-select";
import makeAnimated from "react-select/animated";

interface NewStudent {
  name: string;
  email: string;
  password: string;
  grade_id: string;
  board_id: string;
  lectureGroups: { value: string; label: string }[];
}

type DetailedLectureGroup = LectureGroup & {
  subject: Subject & {
    grade: Grade;
    board: Board;
  };
};

const StudentForm = () => {
  const animatedComponents = makeAnimated();

  const [grades, setGrades] = useState<Grade[]>();
  const [boards, setBoards] = useState<Board[]>();
  const router = useRouter();
  const [availableLectureGroups, setAvailableLectureGroups] = useState<
    DetailedLectureGroup[]
  >([]);
  const [studentDetails, setStudentDetails] = useState<NewStudent>({
    name: "",
    email: "",
    password: "",
    grade_id: "",
    board_id: "",
    lectureGroups: [],
  });

  const getAllBoards = async () => {
    const res = await axios.get("/api/board");
    setBoards(res.data.data);
  };

  const getAllGrades = async () => {
    const res = await axios.get("/api/grade");
    setGrades(res.data.data);
  };

  const getAvailableLectureGroups = async () => {
    const res = await axios.get("/api/lecture-group", {
      params: {
        boardId: studentDetails?.board_id,
        gradeId: studentDetails?.grade_id,
      },
    });

    setAvailableLectureGroups(res.data.data);
  };

  const getLectureGroupOptions = () => {
    let avaiableOptions = [];
    for (let lectureGroup of availableLectureGroups) {
      avaiableOptions.push({
        value: lectureGroup.id.toString(),
        label: `${lectureGroup.subject.name} ${lectureGroup.name} (${lectureGroup.subject.board.key}-${lectureGroup.subject.grade.name})`,
      });
    }
    return avaiableOptions;
  };

  const saveNewStudent = async () => {
    let body = {
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      studentPassword: studentDetails.password,
      studentBoardId: parseInt(studentDetails.board_id),
      studentGradeId: parseInt(studentDetails.grade_id),
      studentLectureGroups: studentDetails.lectureGroups,
    };

    const validation = studentSchema.safeParse({
      ...body,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    const res = await axios.post("/api/student", body);

    if (res.data.status) {
      toast.success("New Student Added");
      router.push("/admin/students");
    }
  };

  useEffect(() => {
    getAllBoards();
    getAllGrades();
  }, []);

  useEffect(() => {
    getAvailableLectureGroups();
  }, [studentDetails?.board_id, studentDetails?.grade_id]);

  return (
    <Flex className="h-fit w-full py-5" direction={"column"} gap={"2"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <Heading mb={"6"} mt="5">
          Add New Student
        </Heading>
      </Flex>
      <Flex
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
        direction={"column"}
        gap={"6"}
        p="5"
        px="8"
      >
        <Heading size={"2"} my={"2"}>
          Basic Details
        </Heading>
        <Flex gap={"2"}>
          <Flex direction={"column"} gap={"2"} className="w-1/3">
            <Text size={"1"}>Name</Text>
            <TextField.Root>
              <TextField.Input
                onChange={(e) =>
                  setStudentDetails({
                    ...studentDetails,
                    name: e.target.value,
                  })
                }
              />
            </TextField.Root>
          </Flex>
          <Flex direction={"column"} gap={"2"} className="w-1/3">
            <Text size={"1"}>Email</Text>
            <TextField.Root>
              <TextField.Input
                onChange={(e) =>
                  setStudentDetails({
                    ...studentDetails,
                    email: e.target.value,
                  })
                }
              />
            </TextField.Root>
          </Flex>
          <Flex direction={"column"} gap={"2"} className="w-1/3">
            <Text size={"1"}>Password</Text>
            <TextField.Root>
              <TextField.Input
                onChange={(e) =>
                  setStudentDetails({
                    ...studentDetails,
                    password: e.target.value,
                  })
                }
              />
            </TextField.Root>
          </Flex>
        </Flex>
        <Flex gap={"2"}>
          <Flex direction={"column"} gap={"2"} className="w-1/2">
            <Text size={"1"}>Board</Text>
            <Select.Root
              onValueChange={(value) => {
                setStudentDetails({
                  ...studentDetails,
                  board_id: value,
                });
              }}
            >
              <Select.Trigger />
              <Select.Content position="popper">
                {boards?.map((board) => (
                  <Select.Item value={board.id.toString()} key={board.id}>
                    {board.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
          <Flex direction={"column"} gap={"2"} className="w-1/2">
            <Text size={"1"}>Grade</Text>
            <Select.Root
              onValueChange={(value) => {
                setStudentDetails({
                  ...studentDetails,
                  grade_id: value,
                });
              }}
            >
              <Select.Trigger />
              <Select.Content position="popper">
                {grades?.map((grade) => (
                  <Select.Item value={grade.id.toString()} key={grade.id}>
                    {grade.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
        direction={"column"}
        gap={"6"}
        p="5"
        px="8"
      >
        <Heading size={"2"} my={"2"}>
          Lecture Group Details
        </Heading>
        <Flex gap={"2"}>
          <Flex direction={"column"} gap={"2"} className="w-full">
            <Text size={"1"}>Lecture Groups</Text>
            <MultiSelect
              components={animatedComponents}
              options={getLectureGroupOptions()}
              isDisabled={!studentDetails.board_id || !studentDetails.grade_id}
              onChange={(e: any) => {
                setStudentDetails({
                  ...studentDetails,
                  lectureGroups: [...e],
                });
              }}
              isMulti
              className="text-sm"
              theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  primary25: "white",
                  primary: "none",
                  neutral10: "#ebe5ff",
                  neutral80: "#6752ba",
                },
              })}
            />
            {(!studentDetails.board_id || !studentDetails.grade_id) && (
              <Text size={"1"} color="crimson">
                Select a grade and board to add a lecture group.
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex justify={"end"}>
          <Button variant="soft" onClick={() => saveNewStudent()}>
            Add Student
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StudentForm;
