"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
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
import ChapterDialog from "./ChapterDialog";
import { Board, Grade, Chapter, Subject } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import { useRouter } from "next/navigation";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import Pagination from "@/app/components/Pagination";
import StatusFilter from "@/app/components/filters/StatusFilter";

interface Props {
  params: {
    id: string;
  };
}

const ChaptersPage = ({ params }: Props) => {
  const [chapters, setChapters] = useState<Chapter[]>();
  const [subject, setSubject] = useState<Subject>();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  const router = useRouter();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    numberOfItems: number;
    count: number;
  }>({
    pageNumber: 0,
    numberOfItems: 7,
    count: 0,
  });

  const getAllChapters = async () => {
    const res = await axios.get("/api/chapter", {
      params: {
        searchText,
        subjectId: params.id,
        pageNumber: pagination.pageNumber,
        numberOfItems: pagination.numberOfItems,
        status,
      },
    });
    setChapters(res.data.data);
    setPagination({
      ...pagination,
      count: res.data.count,
    });
  };

  const getSubject = async () => {
    const res = await axios.get("/api/subject", {
      params: {
        id: params.id,
      },
    });

    setSubject(res.data.data[0]);
  };
  const deleteChapter = async (id: number) => {
    try {
      const res = await axios.delete("/api/chapter", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Chapter Deleted");
      }
      getAllChapters();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getSubject();
    getAllChapters();
  }, [searchText, pagination.numberOfItems, pagination.pageNumber, status]);

  return (
    <Flex className="w-full min-h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mt={"5"}>{subject?.name} Chapters</Heading>
        <Flex justify={"between"} mb={"2"} mt={"6"} align={"end"}>
          <SearchBar
            placeholder={"Search For Chapter"}
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
            <ChapterDialog
              title="Add Chapter"
              chapterStatus={true}
              buttonIcon={<PlusIcon />}
              buttonText={"Add New"}
              type="new"
              getAllChapters={getAllChapters}
              subjectId={params.id}
            />
          </Flex>
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Chapter Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {chapters?.map((chapter) => (
              <Table.Row align={"center"} key={chapter.id}>
                <Table.RowHeaderCell>{chapter.name}</Table.RowHeaderCell>
                <Table.Cell>
                  <StatusBadge status={chapter.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <ChapterDialog
                      title="Update Chapter"
                      type="update"
                      buttonIcon={
                        <Pencil2Icon className="cursor-pointer text-slate-500" />
                      }
                      chapterStatus={chapter.status}
                      chapterName={chapter.name}
                      getAllChapters={getAllChapters}
                      id={chapter.id}
                      subjectId={params.id}
                      chapterNumber={chapter.chapter_number || undefined}
                    ></ChapterDialog>
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteChapter(chapter.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={chapter.name}
                      itemToBeDeletedType="Chapter"
                      confirmDelete={() => deleteChapter(chapter.id)}
                    />
                    <Button
                      variant="soft"
                      color="blue"
                      onClick={() =>
                        router.push(
                          `/admin/subjects/${params.id}/chapters/${chapter.id}`
                        )
                      }
                    >
                      <ArrowRightIcon />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
            {chapters?.length == 0 && (
              <Table.Row>
                <Table.Cell>No Results Found.</Table.Cell>
              </Table.Row>
            )}
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

export default ChaptersPage;
