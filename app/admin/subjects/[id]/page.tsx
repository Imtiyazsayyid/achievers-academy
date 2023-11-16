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
import { Board, Grade, Chapter } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import { useRouter } from "next/navigation";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";

interface Props {
  params: {
    id: string;
  };
}

const ChaptersPage = ({ params }: Props) => {
  const [chapters, setChapters] = useState<Chapter[]>();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const getAllChapters = async () => {
    const res = await axios.get("/api/chapter", {
      params: {
        searchText,
        subjectId: params.id,
      },
    });
    setChapters(res.data.data);
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
    getAllChapters();
  }, [searchText]);

  return (
    <Flex className="h-[90vh] w-full">
      <Flex
        direction={"column"}
        m={"9"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <GoBack />
        <Heading mt={"5"}>Chapters</Heading>
        <Flex justify={"between"} mb={"2"} mt={"6"}>
          <SearchBar
            placeholder={"Search For Chapter"}
            searchText={searchText}
            setSearchText={setSearchText}
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
    </Flex>
  );
};

export default ChaptersPage;
