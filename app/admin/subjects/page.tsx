"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeOpenIcon,
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
import SubjectDialog from "./SubjectDialog";
import { Board, Grade, Subject } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import { useRouter } from "next/navigation";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import Pagination from "@/app/components/Pagination";
import StatusFilter from "@/app/components/filters/StatusFilter";
import BoardFilter from "@/app/components/filters/BoardFilter";
import GradeFilter from "@/app/components/filters/GradeFilter";

type DetailedSubject = Subject & {
  grade: Grade;
  board: Board;
};

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<DetailedSubject[]>();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");
  const [boardId, setBoardId] = useState("all");
  const [gradeId, setGradeId] = useState("all");

  const [pagination, setPagination] = useState<{
    pageNumber: number;
    numberOfItems: number;
    count: number;
  }>({
    pageNumber: 0,
    numberOfItems: 7,
    count: 0,
  });

  const router = useRouter();

  const getAllSubjects = async () => {
    const res = await axios.get("/api/subject", {
      params: {
        searchText,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
        boardId,
        gradeId,
      },
    });
    setSubjects(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };

  const deleteSubject = async (id: number) => {
    try {
      const res = await axios.delete("/api/subject", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Subject Deleted");
      }
      getAllSubjects();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllSubjects();
  }, [searchText, status, boardId, gradeId]);

  useEffect(() => {
    getAllSubjects();
  }, [pagination.numberOfItems, pagination.pageNumber]);

  return (
    <Flex className="w-full min-h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mt={"5"}>Subjects</Heading>
        <Flex justify={"between"} mb={"2"} mt={"6"} align={"end"}>
          <SearchBar
            placeholder={"Search For Subject"}
            searchText={searchText}
            setSearchText={setSearchText}
            setPagination={(pagination) => setPagination(pagination)}
            pagination={pagination}
          />
          <Flex gap={"2"} align={"end"}>
            <StatusFilter
              status={status}
              setStatus={(status) => setStatus(status)}
            />
            <BoardFilter
              boardId={boardId}
              setBoardId={(boardId) => setBoardId(boardId)}
            />
            <GradeFilter
              gradeId={gradeId}
              setGradeId={(gradeId) => setGradeId(gradeId)}
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
                      subjectImage={subject.img}
                      getAllSubjects={getAllSubjects}
                      gradeId={subject.grade_id}
                      boardId={subject.board_id}
                      id={subject.id}
                    ></SubjectDialog>
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteSubject(subject.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={subject.name}
                      itemToBeDeletedType="Board"
                      confirmDelete={() => deleteSubject(subject.id)}
                    />
                    <Button
                      variant="soft"
                      color="blue"
                      onClick={() =>
                        router.push(`/admin/subjects/${subject.id}`)
                      }
                    >
                      <ArrowRightIcon />
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
      {/* {(!pagination.maxPageNumber || pagination.maxPageNumber <= 1) && ( */}
      <Pagination
        pagination={pagination}
        setPagination={(pagination) => setPagination(pagination)}
      />
      {/* )} */}
    </Flex>
  );
};

export default SubjectsPage;
