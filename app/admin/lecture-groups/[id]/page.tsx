"use client";

import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import GoBack from "@/app/components/GoBack";
import SearchBar from "@/app/components/SearchBar";
import StatusBadge from "@/app/components/StatusBadge";
import { Student, StudentLectureGroupMapper } from "@prisma/client";
import { Flex, Heading, ScrollArea, Table } from "@radix-ui/themes";
import axios from "axios";
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

  const getAllLectureGroupStudents = async () => {
    const res = await axios.get("/api/student/lecture-group", {
      params: {
        lectureGroupId: params.id,
        searchText,
      },
    });
    setLectureGroupStudents(res.data.data);
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

  useEffect(() => {
    getAllLectureGroupStudents();
  }, [searchText]);

  return (
    <Flex className="min-h-[90vh] w-full">
      <Flex
        direction={"column"}
        m={"9"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <GoBack />
        <Heading mb={"6"} mt="5">
          Lecture Group Students
        </Heading>
        <Flex justify={"between"} mb={"2"}>
          <SearchBar
            placeholder={"Search For Lecture Group"}
            searchText={searchText}
            setSearchText={setSearchText}
          />
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
                    <DeleteConfirmation
                      itemToBeDeletedName={student.student.name}
                      itemToBeDeletedType="Lecture Group Student"
                      confirmDelete={() => deleteLectureGroup(student.id)}
                    />
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

export default LectureGroupView;
