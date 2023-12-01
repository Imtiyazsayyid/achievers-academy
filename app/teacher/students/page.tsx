"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
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
import { Board, Grade, Student, Subject } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/Pagination";
import StatusFilter from "@/app/components/filters/StatusFilter";
import BoardFilter from "@/app/components/filters/BoardFilter";
import GradeFilter from "@/app/components/filters/GradeFilter";

type DetailedStudent = Student & {
  board: Board;
  grade: Grade;
  subjects: Subject[];
};

const StudentsPage = () => {
  const [students, setStudents] = useState<DetailedStudent[]>();
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

  const getAllStudents = async () => {
    const res = await axios.get("/api/student", {
      params: {
        searchText,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
        boardId,
        gradeId,
      },
    });
    setStudents(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };

  const deleteStudent = async (id: number) => {
    try {
      const res = await axios.delete("/api/student", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Student Deleted");
      }
      getAllStudents();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllStudents();
  }, [
    searchText,
    pagination.numberOfItems,
    pagination.pageNumber,
    status,
    boardId,
    gradeId,
  ]);

  return (
    <Flex className="w-full min-h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mb={"6"} mt="5">
          All Students
        </Heading>
        <Flex justify={"between"} mb={"2"} align={"end"}>
          <SearchBar
            placeholder={"Search For Student"}
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
            <Button
              variant="soft"
              onClick={() => router.push("/admin/students/new")}
            >
              <PlusIcon /> Add New
            </Button>
            {/* <StudentDialog
            title="Add Student"
            studentStatus={true}
            buttonIcon={<PlusIcon />}
            buttonText={"Add New"}
            type="new"
            getAllStudents={getAllStudents}
          /> */}
          </Flex>
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Board</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Grade</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {students?.map((student) => (
              <Table.Row align={"center"} key={student.id}>
                <Table.RowHeaderCell>{student.name}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{student.email}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{student.board.key}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{student.grade.name}</Table.RowHeaderCell>
                <Table.Cell>
                  <StatusBadge status={student.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <Button
                      variant="soft"
                      onClick={() =>
                        router.push("/admin/students/edit/" + student.id)
                      }
                    >
                      <Pencil2Icon />
                    </Button>
                    {/* <StudentDialog
                      title="Update Student"
                      type="update"
                      buttonIcon={
                        <Pencil2Icon className="cursor-pointer text-slate-500" />
                      }
                      studentStatus={student.status}
                      studentName={student.name}
                      getAllStudents={getAllStudents}
                      id={student.id}
                    ></StudentDialog> */}
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteStudent(student.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={student.name}
                      itemToBeDeletedType="Student"
                      confirmDelete={() => deleteStudent(student.id)}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
      <Pagination
        pagination={pagination}
        setPagination={(pagination) => setPagination(pagination)}
      />
    </Flex>
  );
};

export default StudentsPage;
