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
import Pagination from "@/app/components/Pagination";
import StatusFilter from "@/app/components/filters/StatusFilter";
import BoardFilter from "@/app/components/filters/BoardFilter";
import GradeFilter from "@/app/components/filters/GradeFilter";

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

  const getAllLectureGroups = async () => {
    const res = await axios.get("/api/lecture-group", {
      params: {
        searchText,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
        filterBoardId: boardId,
        filterGradeId: gradeId,
      },
    });
    setLectureGroups(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
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
          Lecture Groups
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
            <BoardFilter
              boardId={boardId}
              setBoardId={(boardId) => setBoardId(boardId)}
            />
            <GradeFilter
              gradeId={gradeId}
              setGradeId={(gradeId) => setGradeId(gradeId)}
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
        </Flex>

        {/* Table */}

        <Table.Root variant="surface" className="">
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
      <Pagination
        pagination={pagination}
        setPagination={(pagination) => setPagination(pagination)}
      />
    </Flex>
  );
};

export default LectureGroupsPage;
