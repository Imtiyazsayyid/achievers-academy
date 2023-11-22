import { Grade } from "@prisma/client";
import { Flex, Select, Text } from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  gradeId: string;
  setGradeId: (value: string) => void;
}

const GradeFilter = ({ gradeId, setGradeId }: Props) => {
  const [grades, setGrades] = useState<Grade[]>();

  const getAllGrades = async () => {
    const res = await axios.get("/api/grade");
    setGrades(res.data.data);
  };

  useEffect(() => {
    getAllGrades();
  }, []);

  return (
    <Flex direction={"column"}>
      <Text size={"1"} mb={"1"} className="text-slate-500">
        Grade
      </Text>
      <Select.Root
        size="2"
        defaultValue={gradeId.toString()}
        onValueChange={(value) => setGradeId(value)}
      >
        <Select.Trigger className="w-48" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Grade</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {grades?.map((grade) => (
              <Select.Item key={grade.id} value={grade.id.toString()}>
                {grade.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default GradeFilter;
