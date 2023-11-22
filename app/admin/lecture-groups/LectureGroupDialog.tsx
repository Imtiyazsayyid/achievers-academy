import { lectureGroupSchema } from "@/app/validationSchemas";
import { Board, Grade, Subject, Teacher } from "@prisma/client";
import { ButtonIcon, PlusIcon } from "@radix-ui/react-icons";
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
  lectureGroupName?: string;
  subjectId?: string;
  teacherId?: string;
  buttonIcon?: ReactNode;
  lectureGroupStatus?: boolean;
  getAllLectureGroups: () => void;
}

const LectureGroupDialog = ({
  id,
  type,
  buttonText,
  title,
  lectureGroupName,
  subjectId,
  teacherId,
  lectureGroupStatus,
  buttonIcon,
  getAllLectureGroups,
}: Props) => {
  const [lectureGroupDetails, setLectureGroupDetails] = useState({
    lectureGroupName,
    subjectId,
    teacherId,
    lectureGroupStatus,
  });

  async function addNewLectureGroup() {
    const res = await axios.post("/api/lecture-group", {
      lectureGroupName: lectureGroupDetails.lectureGroupName,
      subjectId: lectureGroupDetails.subjectId,
      teacherId: lectureGroupDetails.teacherId,
      lectureGroupStatus: lectureGroupDetails.lectureGroupStatus,
    });

    getAllLectureGroups();

    setLectureGroupDetails({
      lectureGroupName: "",
      subjectId: "",
      teacherId: "",
      lectureGroupStatus: true,
    });

    if (res.data.status) {
      toast.success("Lecture Group Added");
    }
  }
  async function updateLectureGroup() {
    let body = {
      lectureGroupId: id,
      lectureGroupName: lectureGroupDetails.lectureGroupName,
      subjectId: lectureGroupDetails.subjectId,
      teacherId: lectureGroupDetails.teacherId,
      lectureGroupStatus: lectureGroupDetails.lectureGroupStatus,
    };
    const res = await axios.put("/api/lecture-group", body);
    if (res.data.status) {
      toast.success("Lecture Group Updated");
    }

    getAllLectureGroups();
  }

  const handleSubmit = () => {
    const validation = lectureGroupSchema.safeParse({
      lectureGroupName: lectureGroupDetails.lectureGroupName,
      subjectId:
        lectureGroupDetails.subjectId &&
        parseInt(lectureGroupDetails.subjectId),
      teacherId:
        lectureGroupDetails.teacherId &&
        parseInt(lectureGroupDetails.teacherId),
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    if (type === "new") {
      addNewLectureGroup();
    }
    if (type === "update") {
      updateLectureGroup();
    }
  };

  type DetailedSubject = Subject & {
    board: Board;
    grade: Grade;
  };

  const [subjects, setSubjects] = useState<DetailedSubject[]>();
  const [teachers, setTeachers] = useState<Teacher[]>();

  const getAllSubjects = async () => {
    const res = await axios.get("/api/subject");
    setSubjects(res.data.data);
  };

  const getAllTeachers = async () => {
    const res = await axios.get("/api/teacher");
    setTeachers(res.data.data);
  };
  useEffect(() => {
    getAllSubjects();
    getAllTeachers();
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

          <Flex direction="column" gap="3" mt={"6"}>
            <label>
              <TextField.Input
                defaultValue={lectureGroupDetails.lectureGroupName}
                placeholder="Enter Lecture Group Name"
                onChange={(e) =>
                  setLectureGroupDetails({
                    ...lectureGroupDetails,
                    lectureGroupName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <Select.Root
                defaultValue={lectureGroupDetails.subjectId}
                onValueChange={(value) =>
                  setLectureGroupDetails({
                    ...lectureGroupDetails,
                    subjectId: value,
                  })
                }
              >
                <Select.Trigger
                  placeholder="Select Subject"
                  className="w-full"
                />
                <Select.Content position="popper">
                  {subjects?.map((subject) => (
                    <Select.Item value={subject.id.toString()} key={subject.id}>
                      {subject.name} ({subject.board.key}-{subject.grade.name})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>
            <label>
              <Select.Root
                defaultValue={lectureGroupDetails.teacherId}
                onValueChange={(value) =>
                  setLectureGroupDetails({
                    ...lectureGroupDetails,
                    teacherId: value,
                  })
                }
              >
                <Select.Trigger
                  placeholder="Select Teacher"
                  className="w-full"
                />
                <Select.Content position="popper">
                  {teachers?.map((teacher) => (
                    <Select.Item value={teacher.id.toString()} key={teacher.id}>
                      {teacher.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>
            <label>
              <Flex gap="2" className="border w-fit p-2 shadow-sm rounded-md">
                <Text size={"2"}>Status</Text>{" "}
                <Switch
                  checked={lectureGroupDetails.lectureGroupStatus}
                  variant="soft"
                  color="green"
                  onCheckedChange={(value) =>
                    setLectureGroupDetails({
                      ...lectureGroupDetails,
                      lectureGroupStatus: value,
                    })
                  }
                />
              </Flex>
            </label>
          </Flex>

          <Flex gap="3" mt="6" justify="end">
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

export default LectureGroupDialog;
