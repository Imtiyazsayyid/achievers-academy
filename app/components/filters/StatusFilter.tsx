import { Flex, Select, Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: string;
  setStatus: (value: string) => void;
}

const StatusFilter = ({ status, setStatus }: Props) => {
  return (
    <Flex direction={"column"}>
      <Text size={"1"} mb={"1"} className="text-slate-500">
        Status
      </Text>
      <Select.Root
        size="2"
        defaultValue={status}
        onValueChange={(value) => setStatus(value)}
      >
        <Select.Trigger className="w-28" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Status</Select.Label>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="inactive">Inactive</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default StatusFilter;
