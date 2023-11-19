"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
  EyeOpenIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Heading,
  Switch,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import LectureGroupDialog from "./LectureGroupDialog";
import { Board, Grade, LectureGroup, Subject, Teacher } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import { useRouter } from "next/navigation";

type DetailedLectureGroup = LectureGroup & {
  subject: Subject & {
    board: Board;
    grade: Grade;
  };
  teacher: Teacher;
};

const LectureGroupsPage = () => {
  const [lectureGroups, setLectureGroups] = useState<DetailedLectureGroup[]>();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const getAllLectureGroups = async () => {
    const res = await axios.get("/api/lecture-group", {
      params: {
        searchText,
      },
    });
    setLectureGroups(res.data.data);
  };

  const deleteLectureGroup = async (id: number) => {
    try {
      const res = await axios.delete("/api/lecture-group", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Lecture Group Deleted");
      }
      getAllLectureGroups();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllLectureGroups();
  }, [searchText]);

  return (
    <Flex className="h-[90vh] w-full">
      <Flex
        direction={"column"}
        m={"9"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <GoBack />
        <Heading mb={"6"} mt="5">
          Lecture Groups
        </Heading>
        <Flex justify={"between"} mb={"2"}>
          <SearchBar
            placeholder={"Search For Lecture Group"}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <LectureGroupDialog
            title="Add Lecture Group"
            lectureGroupStatus={true}
            buttonIcon={<PlusIcon />}
            buttonText={"Add New"}
            type="new"
            getAllLectureGroups={getAllLectureGroups}
          />
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Board </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Grade</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Teacher</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {lectureGroups?.map((lectureGroup) => (
              <Table.Row align={"center"} key={lectureGroup.id}>
                <Table.RowHeaderCell>{lectureGroup.name}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {lectureGroup.subject.board?.key}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {lectureGroup.subject.grade?.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {lectureGroup.subject?.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {lectureGroup.teacher.name}
                </Table.RowHeaderCell>
                <Table.Cell>
                  <StatusBadge status={lectureGroup.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <LectureGroupDialog
                      title="Update LectureGroup"
                      type="update"
                      buttonIcon={
                        <Pencil2Icon className="cursor-pointer text-slate-500" />
                      }
                      lectureGroupStatus={lectureGroup.status}
                      subjectId={lectureGroup.subject_id.toString()}
                      teacherId={lectureGroup.teacher_id.toString()}
                      lectureGroupName={lectureGroup.name}
                      getAllLectureGroups={getAllLectureGroups}
                      id={lectureGroup.id}
                    ></LectureGroupDialog>
                    <DeleteConfirmation
                      itemToBeDeletedName={lectureGroup.name}
                      itemToBeDeletedType="LectureGroup"
                      confirmDelete={() => deleteLectureGroup(lectureGroup.id)}
                    />
                    <Button
                      color="blue"
                      variant="soft"
                      onClick={() =>
                        router.push(`/admin/lecture-groups/${lectureGroup.id}`)
                      }
                    >
                      <EyeOpenIcon />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
    </Flex>
  );
};

export default LectureGroupsPage;
