"use client";
import { teacherSchema } from "@/app/validationSchemas";
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
  teacherName?: string;
  teacherEmail?: string;
  teacherStatus?: boolean;
  teacherPassword?: string;
  buttonIcon?: ReactNode;
  getAllTeachers: () => void;
}

const SubjectDialog = ({
  id,
  type,
  buttonText,
  title,
  buttonIcon,
  teacherName,
  teacherEmail,
  teacherStatus,
  teacherPassword,
  getAllTeachers,
}: Props) => {
  const [teacherDetails, setTeacherDetails] = useState({
    teacherName: teacherName,
    teacherEmail: teacherEmail,
    teacherStatus: teacherStatus,
    teacherPassword: teacherPassword,
  });

  async function addNewSubject() {
    const res = await axios.post("/api/teacher", {
      teacherName: teacherDetails.teacherName,
      teacherEmail: teacherDetails.teacherEmail,
      teacherStatus: teacherDetails.teacherStatus,
      teacherPassword: teacherDetails.teacherPassword,
    });

    clearForm();

    getAllTeachers();

    if (res.data.status) {
      toast.success("Teacher Added");
    }
  }
  async function updateSubject() {
    let body = {
      teacherId: id,
      teacherName: teacherDetails.teacherName,
      teacherEmail: teacherDetails.teacherEmail,
      teacherStatus: teacherDetails.teacherStatus,
      teacherPassword: teacherDetails.teacherPassword,
    };

    const res = await axios.put("/api/teacher", body);
    if (res.data.status) {
      toast.success("Teacher Updated");
    }

    getAllTeachers();
  }

  const handleSubmit = () => {
    const validation = teacherSchema.safeParse({
      teacherName: teacherDetails.teacherName,
      teacherEmail: teacherDetails.teacherEmail,
      teacherPassword: teacherDetails.teacherPassword,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    if (type === "new") {
      addNewSubject();
    }
    if (type === "update") {
      updateSubject();
    }
  };

  const clearForm = () => {
    setTeacherDetails({
      teacherName: "",
      teacherEmail: "",
      teacherPassword: "",
      teacherStatus: true,
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
                defaultValue={teacherDetails.teacherName}
                placeholder="Enter Name"
                onChange={(e) =>
                  setTeacherDetails({
                    ...teacherDetails,
                    teacherName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <TextField.Input
                defaultValue={teacherDetails.teacherEmail}
                placeholder="Enter Email"
                onChange={(e) =>
                  setTeacherDetails({
                    ...teacherDetails,
                    teacherEmail: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <TextField.Input
                defaultValue={teacherDetails.teacherPassword}
                placeholder="Enter Password"
                onChange={(e) =>
                  setTeacherDetails({
                    ...teacherDetails,
                    teacherPassword: e.target.value,
                  })
                }
              />
            </label>

            <label>
              <Flex gap="2" className="border w-fit p-2 shadow-sm rounded-md">
                <Text size={"2"}>Status</Text>{" "}
                <Switch
                  checked={teacherDetails.teacherStatus}
                  variant="soft"
                  color="green"
                  onCheckedChange={(value) =>
                    setTeacherDetails({
                      ...teacherDetails,
                      teacherStatus: value,
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
