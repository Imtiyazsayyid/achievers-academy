import { Board } from "@prisma/client";
import { Flex, Select, Text } from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  boardId: string;
  setBoardId: (value: string) => void;
}

const BoardFilter = ({ boardId, setBoardId }: Props) => {
  const [boards, setBoards] = useState<Board[]>();

  const getAllBoards = async () => {
    const res = await axios.get("/api/board");
    setBoards(res.data.data);
  };

  useEffect(() => {
    getAllBoards();
  }, []);

  return (
    <Flex direction={"column"}>
      <Text size={"1"} mb={"1"} className="text-slate-500">
        Board
      </Text>
      <Select.Root
        size="2"
        defaultValue={boardId.toString()}
        onValueChange={(value) => setBoardId(value)}
      >
        <Select.Trigger className="w-28" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Board</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {boards?.map((board) => (
              <Select.Item key={board.id} value={board.id.toString()}>
                {board.key}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default BoardFilter;
