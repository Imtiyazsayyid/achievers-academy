import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: boolean;
}

const StatusBadge = ({ status }: Props) => {
  return (
    <Badge color={status ? "green" : "crimson"}>
      {status ? "Active" : "Inactive"}
    </Badge>
  );
};

export default StatusBadge;
