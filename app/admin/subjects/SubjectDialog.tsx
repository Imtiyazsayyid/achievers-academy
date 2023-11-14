"use client";
import { Board, Grade } from "@prisma/client";
import {
  Button,
  Dialog,
  Flex,
  Switch,
  TextField,
  Text,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  id?: number;
  type: "new" | "update";
  buttonText?: string;
  title: string;
  gradeId?: number;
  boardId?: number;
  subjectName?: string;
  buttonIcon?: ReactNode;
  subjectShortForm?: string;
  subjectStatus?: boolean;
  getAllSubjects: () => void;
}

const SubjectDialog = ({
  id,
  type,
  buttonText,
  title,
  subjectName,
  subjectShortForm,
  gradeId,
  boardId,
  subjectStatus,
  buttonIcon,
  getAllSubjects,
}: Props) => {
  const [subjectDetails, setSubjectDetails] = useState({
    subjectName: subjectName,
    subjectShortForm: subjectShortForm,
    subjectStatus: subjectStatus,
    gradeId: gradeId ? gradeId.toString() : "",
    boardId: boardId ? boardId.toString() : "",
  });

  async function addNewSubject() {
    const res = await axios.post("/api/subject", {
      subjectName: subjectDetails.subjectName,
      subjectShortForm: subjectDetails.subjectShortForm,
      subjectStatus: subjectDetails.subjectStatus,
      gradeId: subjectDetails.gradeId,
      boardId: subjectDetails.boardId,
    });

    clearForm();

    getAllSubjects();

    if (res.data.status) {
      toast.success("Subject Added");
    }
  }
  async function updateSubject() {
    let body = {
      subjectId: id,
      subjectName: subjectDetails.subjectName,
      subjectShortForm: subjectDetails.subjectShortForm,
      subjectStatus: subjectDetails.subjectStatus,
      gradeId: subjectDetails.gradeId,
      boardId: subjectDetails.boardId,
    };

    console.log(body);

    const res = await axios.put("/api/subject", body);
    if (res.data.status) {
      toast.success("Subject Updated");
    }

    getAllSubjects();
  }

  const handleSubmit = () => {
    if (type === "new") {
      addNewSubject();
    }
    if (type === "update") {
      updateSubject();
    }
  };

  const clearForm = () => {
    setSubjectDetails({
      subjectName: "",
      subjectShortForm: "",
      subjectStatus: true,
      gradeId: "",
      boardId: "",
    });
  };

  const [grades, setGrades] = useState<Grade[]>();
  const [boards, setBoards] = useState<Board[]>();

  const getAllBoards = async () => {
    const res = await axios.get("/api/board");
    setBoards(res.data.data);
  };

  const getAllGrades = async () => {
    const res = await axios.get("/api/grade");
    setGrades(res.data.data);
  };

  useEffect(() => {
    getAllBoards();
    getAllGrades();
  }, []);

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size={"2"} variant="soft">
            {buttonIcon}
            {buttonText}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>{title}</Dialog.Title>

          <Flex direction="column" gap="3">
            <label>
              <TextField.Input
                defaultValue={subjectDetails.subjectName}
                placeholder="Enter Subject Name"
                onChange={(e) =>
                  setSubjectDetails({
                    ...subjectDetails,
                    subjectName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <TextField.Input
                defaultValue={subjectDetails.subjectShortForm}
                placeholder="Enter Subject Shortform"
                onChange={(e) =>
                  setSubjectDetails({
                    ...subjectDetails,
                    subjectShortForm: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <Flex gap={"2"} pr="2">
                <Select.Root
                  defaultValue={
                    subjectDetails.gradeId
                      ? subjectDetails.gradeId.toString()
                      : undefined
                  }
                  onValueChange={(e) =>
                    setSubjectDetails({
                      ...subjectDetails,
                      gradeId: e,
                    })
                  }
                >
                  <Select.Trigger className="w-1/2" placeholder="Grade" />
                  <Select.Content position="popper">
                    {grades?.map((grade) => (
                      <Select.Item key={grade.id} value={grade.id.toString()}>
                        {grade.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  defaultValue={
                    subjectDetails.boardId
                      ? subjectDetails.boardId.toString()
                      : undefined
                  }
                  onValueChange={(e) =>
                    setSubjectDetails({
                      ...subjectDetails,
                      boardId: e,
                    })
                  }
                >
                  <Select.Trigger className="w-1/2" placeholder="Board" />
                  <Select.Content position="popper">
                    {boards?.map((board) => (
                      <Select.Item key={board.id} value={board.id.toString()}>
                        {board.key}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
            </label>

            <label>
              <Flex gap="2" className="border w-fit p-2 shadow-sm rounded-md">
                <Text size={"2"}>Status</Text>{" "}
                <Switch
                  checked={subjectDetails.subjectStatus}
                  variant="soft"
                  color="green"
                  onCheckedChange={(value) =>
                    setSubjectDetails({
                      ...subjectDetails,
                      subjectStatus: value,
                    })
                  }
                />
              </Flex>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleSubmit}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default SubjectDialog;
