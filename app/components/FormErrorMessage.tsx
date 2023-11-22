import { Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  message: string;
}

const FormErrorMessage = ({ message }: Props) => {
  return <Text className="text-xs text-red-400">{message}</Text>;
};

export default FormErrorMessage;
