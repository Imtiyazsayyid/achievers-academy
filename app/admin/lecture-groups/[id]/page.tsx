"use client";

import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import GoBack from "@/app/components/GoBack";
import Pagination from "@/app/components/Pagination";
import SearchBar from "@/app/components/SearchBar";
import StatusBadge from "@/app/components/StatusBadge";
import StatusFilter from "@/app/components/filters/StatusFilter";
import { Student, StudentLectureGroupMapper } from "@prisma/client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button, Flex, Heading, ScrollArea, Table } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  params: {
    id: string;
  };
}

type LectureGroupStudent = StudentLectureGroupMapper & {
  student: Student;
};

const LectureGroupView = ({ params }: Props) => {
  const [searchText, setSearchText] = useState("");
  const [lectureGroupStudents, setLectureGroupStudents] =
    useState<LectureGroupStudent[]>();
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

  const getAllLectureGroupStudents = async () => {
    const res = await axios.get("/api/student/lecture-group", {
      params: {
        lectureGroupId: params.id,
        searchText,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
      },
    });
    setLectureGroupStudents(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };

  const deleteLectureGroup = async (id: number) => {
    try {
      const res = await axios.delete("/api/student/lecture-group", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Student Removed From Lecture Group");
      }
      getAllLectureGroupStudents();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  const router = useRouter();

  useEffect(() => {
    getAllLectureGroupStudents();
  }, [searchText, pagination.numberOfItems, pagination.pageNumber, status]);

  return (
    <Flex className="w-full min-h-full py-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mb={"6"} mt="5">
          Lecture Group Students
        </Heading>
        <Flex justify={"between"} mb={"2"} align={"end"}>
          <SearchBar
            placeholder={"Search For Lecture Group"}
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
          </Flex>
        </Flex>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Password</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="overflow-hidden overflow-y-scroll border">
            {lectureGroupStudents?.map((student) => (
              <Table.Row align={"center"} key={student.id}>
                <Table.RowHeaderCell>
                  {student.student.name}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {student.student.email}
                </Table.RowHeaderCell>
                <Table.RowHeaderCell>
                  {student.student.password}
                </Table.RowHeaderCell>
                <Table.Cell>
                  <StatusBadge status={student.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <Button
                      variant="soft"
                      onClick={() =>
                        router.push(
                          `/admin/students/edit/${student.student_id}`
                        )
                      }
                    >
                      {" "}
                      <Pencil2Icon />
                    </Button>
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

export default LectureGroupView;
