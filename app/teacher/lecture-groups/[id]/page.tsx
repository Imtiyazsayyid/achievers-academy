"use client";

import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import GoBack from "@/app/components/GoBack";
import Pagination from "@/app/components/Pagination";
import SearchBar from "@/app/components/SearchBar";
import StatusBadge from "@/app/components/StatusBadge";
import StatusFilter from "@/app/components/filters/StatusFilter";
import { Student, StudentLectureGroupMapper } from "@prisma/client";
import { EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
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
      },
    });
    setLectureGroupStudents(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };
  const router = useRouter();

  useEffect(() => {
    getAllLectureGroupStudents();
  }, [searchText, pagination.numberOfItems, pagination.pageNumber]);

  return (
    <Flex className="w-full h-full mr-5" direction={"column"}>
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
          <Flex gap={"2"} align={"end"}></Flex>
        </Flex>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
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
                  <Button
                    variant="soft"
                    color="blue"
                    onClick={() =>
                      router.push(
                        `/teacher/lecture-groups/${params.id}/student/${student.student.id}`
                      )
                    }
                  >
                    <EyeOpenIcon />
                  </Button>
                </Table.RowHeaderCell>
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
