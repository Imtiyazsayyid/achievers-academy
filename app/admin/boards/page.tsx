"use client";
import StatusBadge from "@/app/components/StatusBadge";
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import ScaleLoader from "react-spinners/ScaleLoader";
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
import BoardDialog from "./BoardDialog";
import { Board } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import StatusFilter from "@/app/components/filters/StatusFilter";

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  const getAllBoards = async () => {
    const res = await axios.get("/api/board", {
      params: {
        searchText,
        status,
      },
    });

    setBoards(res.data.data);
  };

  const deleteBoard = async (id: number) => {
    try {
      const res = await axios.delete("/api/board", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Board Deleted");
      }
      getAllBoards();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllBoards();
  }, [searchText, status]);

  return (
    <Flex className="w-full min-h-full mr-5" justify={"center"} align={"start"}>
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
      >
        <Heading mt={"5"}>Boards</Heading>
        <Flex justify={"between"} mb={"2"} mt={"6"} align={"end"}>
          <SearchBar
            placeholder={"Search For Grade"}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <Flex gap={"2"} align={"end"}>
            <StatusFilter
              status={status}
              setStatus={(status) => setStatus(status)}
            />
            <BoardDialog
              title="Add Board"
              boardStatus={true}
              buttonIcon={<PlusIcon />}
              buttonText={"Add New"}
              type="new"
              getAllBoards={getAllBoards}
            />
          </Flex>
        </Flex>

        {/* Table */}

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Board Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Short Form</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {boards?.map((board) => (
              <Table.Row align={"center"} key={board.id}>
                <Table.RowHeaderCell>{board.name}</Table.RowHeaderCell>
                <Table.Cell>{board.key}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={board.status} />
                </Table.Cell>
                <Table.Cell>
                  <Flex gap={"2"}>
                    <BoardDialog
                      title="Update Board"
                      type="update"
                      buttonIcon={
                        <Pencil2Icon className="cursor-pointer text-slate-500" />
                      }
                      boardStatus={board.status}
                      boardShortForm={board.key}
                      boardName={board.name}
                      getAllBoards={getAllBoards}
                      id={board.id}
                    ></BoardDialog>
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteBoard(board.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={board.name}
                      itemToBeDeletedType="Board"
                      confirmDelete={() => deleteBoard(board.id)}
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

export default BoardsPage;
