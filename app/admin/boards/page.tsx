"use client";
import StatusBadge from "@/app/components/StatusBadge";
import { Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
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

const BoardsPage = () => {
  const [boards, setBoards] = useState<Board[]>();

  const getAllBoards = async () => {
    const res = await axios.get("/api/board");
    setBoards(res.data.data);
  };

  const deleteBoard = async (id: number) => {
    const res = await axios.delete("/api/board", {
      params: {
        id,
      },
    });

    if (res.data.status) {
      toast.success("Board Deleted");
    }
    getAllBoards();
  };

  useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <Flex direction={"column"} p={"9"}>
      <Flex justify={"between"} mb={"2"}>
        <Heading>Boards</Heading>
        <BoardDialog
          title="Add Board"
          boardStatus={true}
          buttonIcon={<PlusIcon />}
          buttonText={"Add New"}
          type="new"
          getAllBoards={getAllBoards}
        />
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
                  <Button
                    variant="soft"
                    color="red"
                    onClick={() => deleteBoard(board.id)}
                  >
                    <TrashIcon />
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default BoardsPage;
