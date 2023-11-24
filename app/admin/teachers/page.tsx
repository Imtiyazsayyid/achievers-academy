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
import { Board, Grade, Teacher, Subject, LectureGroup } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/Pagination";
import LectureGroupsHoverCard from "./LectureGroupsHoverCard";
import TeacherDialog from "./TeacherDialog";
import StatusFilter from "@/app/components/filters/StatusFilter";

type DetailedTeacher = Teacher & {
  board: Board;
  grade: Grade;
  subjects: Subject[];
  lectureGroups: DetailedLectureGroup[];
};

type DetailedLectureGroup = LectureGroup & {
  subject: Subject & {
    board: Board;
    grade: Grade;
  };
  teacher: Teacher;
};

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<DetailedTeacher[]>();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

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

  const getAllTeachers = async () => {
    const res = await axios.get("/api/teacher", {
      params: {
        searchText,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
      },
    });
    setTeachers(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };

  const getLectureGroupList = (lectureGroups: DetailedLectureGroup[]) => {
    const lectureGroupList = [];

    for (let lectureGroup of lectureGroups) {
      lectureGroupList.push(
        `${lectureGroup.name} ${lectureGroup.subject.name} (${lectureGroup.subject.board.key}-${lectureGroup.subject.grade.name})`
      );
    }

    return lectureGroupList;
  };

  const deleteTeacher = async (id: number) => {
    try {
      const res = await axios.delete("/api/teacher", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Teacher Deleted");
      }
      getAllTeachers();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllTeachers();
  }, [searchText, pagination.numberOfItems, pagination.pageNumber, status]);

  return (
    <Flex className="w-full min-h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mb={"6"} mt="5">
          All Teachers
        </Heading>
        <Flex justify={"between"} mb={"2"} align={"end"}>
          <SearchBar
            placeholder={"Search For Teacher"}
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
            <TeacherDialog
              title="Add Teacher"
              teacherStatus={true}
              buttonIcon={<PlusIcon />}
              buttonText={"Add New"}
              type="new"
              getAllTeachers={getAllTeachers}
            />
          </Flex>
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Password</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Lecture Groups</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {teachers?.map((teacher) => (
              <Table.Row align={"center"} key={teacher.id}>
                <Table.RowHeaderCell>{teacher.name}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{teacher.email}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{teacher.password}</Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  <LectureGroupsHoverCard
                    lectureGroups={getLectureGroupList(teacher.lectureGroups)}
                  />
                </Table.RowHeaderCell>

                <Table.Cell>
                  <StatusBadge status={teacher.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <TeacherDialog
                      title="Update Teacher"
                      type="update"
                      buttonIcon={
                        <Pencil2Icon className="cursor-pointer text-slate-500" />
                      }
                      teacherStatus={teacher.status}
                      teacherName={teacher.name}
                      teacherEmail={teacher.email}
                      teacherPassword={teacher.password}
                      getAllTeachers={getAllTeachers}
                      id={teacher.id}
                    ></TeacherDialog>
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteTeacher(teacher.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={teacher.name}
                      itemToBeDeletedType="Teacher"
                      confirmDelete={() => deleteTeacher(teacher.id)}
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

export default TeachersPage;
