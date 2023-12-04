"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
  ArrowRightIcon,
  EyeOpenIcon,
  Pencil2Icon,
  PlusIcon,
  QuestionMarkIcon,
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
import { Board, Chapter, Grade, Topic } from "@prisma/client";
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
    chapterId: string;
  };
}

const AllTopicsPage = ({ params }: Props) => {
  const [topics, setTopics] = useState<Topic[]>();
  const [chapter, setChapter] = useState<Chapter>();
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

  const getAllTopics = async () => {
    try {
      const res = await axios.get("/api/topic", {
        params: {
          searchText,
          chapterId: params.chapterId,
          pageNumber: pagination.pageNumber,
          numberOfItems: pagination.numberOfItems,
          status,
        },
      });
      setTopics(res.data.data);
      setPagination({
        ...pagination,
        count: res.data.count,
      });
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  const getChapter = async () => {
    const res = await axios.get("/api/chapter", {
      params: {
        subjectId: params.id,
        chapterId: params.chapterId,
      },
    });

    setChapter(res.data.data[0]);
  };

  const deleteTopic = async (id: number) => {
    try {
      const res = await axios.delete("/api/topic", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Topic Deleted");
      }
      getAllTopics();
    } catch (error) {
      toast.error("Please Delete All Items Inside First");
    }
  };

  useEffect(() => {
    getAllTopics();
    getChapter();
  }, [searchText, pagination.numberOfItems, pagination.pageNumber, status]);

  return (
    <Flex className="w-full min-h-full mr-5" direction={"column"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mt={"5"}>{chapter?.name} Topics</Heading>
        <Flex justify={"between"} mb={"2"} mt={"6"} align={"end"}>
          <SearchBar
            placeholder={"Search For Topic"}
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
            <Button
              variant="soft"
              onClick={() =>
                router.push(
                  `/admin/subjects/${params.id}/chapters/${params.chapterId}/new`
                )
              }
            >
              <PlusIcon />
              Add New
            </Button>
          </Flex>
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Topic Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quiz</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {topics?.map((topic) => (
              <Table.Row align={"center"} key={topic.id}>
                <Table.RowHeaderCell>{topic.name}</Table.RowHeaderCell>
                <Table.Cell>
                  <StatusBadge status={topic.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <Button
                      variant="soft"
                      onClick={() =>
                        router.push(
                          `/admin/subjects/${params.id}/chapters/${params.chapterId}/edit/${topic.id}`
                        )
                      }
                    >
                      <Pencil2Icon />
                    </Button>
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteTopic(topic.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={topic.name}
                      itemToBeDeletedType="Board"
                      confirmDelete={() => deleteTopic(topic.id)}
                    />
                    <Button
                      variant="soft"
                      color="blue"
                      onClick={() =>
                        router.push(
                          `/admin/subjects/${params.id}/chapters/${params.chapterId}/view/${topic.id}`
                        )
                      }
                    >
                      <EyeOpenIcon />
                    </Button>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="soft"
                    onClick={() =>
                      router.push(
                        `/admin/subjects/${params.id}/chapters/${params.chapterId}/quiz/${topic.id}`
                      )
                    }
                  >
                    <QuestionMarkIcon />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {topics?.length == 0 && (
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

export default AllTopicsPage;
