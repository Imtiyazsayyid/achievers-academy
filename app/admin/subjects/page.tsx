"use client";
import StatusBadge from "@/app/components/StatusBadge";
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
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
import SubjectDialog from "./SubjectDialog";
import { Board, Grade, Subject } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";

type DetailedSubject = Subject & {
  grade: Grade;
  board: Board;
};

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<DetailedSubject[]>();
  const [searchText, setSearchText] = useState("");

  const getAllSubjects = async () => {
    const res = await axios.get("/api/subject", {
      params: {
        searchText,
      },
    });
    setSubjects(res.data.data);
  };

  const deleteSubject = async (id: number) => {
    const res = await axios.delete("/api/subject", {
      params: {
        id,
      },
    });

    if (res.data.status) {
      toast.success("Subject Deleted");
    }
    getAllSubjects();
  };

  useEffect(() => {
    getAllSubjects();
  }, [searchText]);

  return (
    <Flex direction={"column"} p={"9"}>
      <Heading>Subjects</Heading>
      <Flex justify={"between"} mb={"2"} mt={"6"}>
        <SearchBar
          placeholder={"Search For Subject"}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <SubjectDialog
          title="Add Subject"
          subjectStatus={true}
          buttonIcon={<PlusIcon />}
          buttonText={"Add New"}
          type="new"
          getAllSubjects={getAllSubjects}
        />
      </Flex>

      {/* Table */}

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Subject Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Short Form</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Grade</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Board</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {subjects?.map((subject) => (
            <Table.Row align={"center"} key={subject.id}>
              <Table.RowHeaderCell>{subject.name}</Table.RowHeaderCell>
              <Table.Cell>{subject.key}</Table.Cell>
              <Table.Cell>{subject.grade.name}</Table.Cell>
              <Table.Cell>{subject.board.key}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={subject.status} />
              </Table.Cell>
              <Table.Cell>
                <Flex gap={"2"}>
                  <SubjectDialog
                    title="Update Subject"
                    type="update"
                    buttonIcon={
                      <Pencil2Icon className="cursor-pointer text-slate-500" />
                    }
                    subjectStatus={subject.status}
                    subjectShortForm={subject.key}
                    subjectName={subject.name}
                    getAllSubjects={getAllSubjects}
                    gradeId={subject.grade_id}
                    boardId={subject.board_id}
                    id={subject.id}
                  ></SubjectDialog>
                  <Button
                    variant="soft"
                    color="red"
                    onClick={() => deleteSubject(subject.id)}
                  >
                    <TrashIcon />
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
          {subjects?.length == 0 && (
            <Table.Row>
              <Table.Cell>No Results Found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default SubjectsPage;
