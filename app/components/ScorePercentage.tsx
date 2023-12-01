import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  prefix?: string;
  score: number;
  outOf: number;
}

const ScorePercentage = ({ score, outOf, prefix }: Props) => {
  const percentage = (score / outOf) * 100;

  const getColor = (percentage: number): "red" | "orange" | "green" => {
    if (percentage <= 35) {
      return "red";
    }
    if (percentage <= 75 && percentage > 35) {
      return "orange";
    }
    if (percentage > 75) {
      return "green";
    }
    return "red";
  };

  return (
    <Badge className="w-fit" color={getColor(percentage)}>
      {prefix} {percentage.toFixed(2)} %
    </Badge>
  );
};

export default ScorePercentage;
