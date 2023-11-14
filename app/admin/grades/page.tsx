"use client";
import StatusBadge from "@/app/components/StatusBadge";
import {
  MagnifyingGlassIcon,
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
import GradeDialog from "./GradeDialog";
import { Grade } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/app/components/SearchBar";

const GradesPage = () => {
  const [grades, setGrades] = useState<Grade[]>();
  const [searchText, setSearchText] = useState("");

  const getAllGrades = async () => {
    const res = await axios.get("/api/grade", {
      params: {
        searchText,
      },
    });
    setGrades(res.data.data);
  };

  const deleteGrade = async (id: number) => {
    const res = await axios.delete("/api/grade", {
      params: {
        id,
      },
    });

    if (res.data.status) {
      toast.success("Grade Deleted");
    }
    getAllGrades();
  };

  useEffect(() => {
    getAllGrades();
  }, [searchText]);

  return (
    <Flex direction={"column"} p={"9"}>
      <Heading mb={"6"}>Grades</Heading>
      <Flex justify={"between"} mb={"2"}>
        <SearchBar
          placeholder={"Search For Grade"}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <GradeDialog
          title="Add Grade"
          gradeStatus={true}
          buttonIcon={<PlusIcon />}
          buttonText={"Add New"}
          type="new"
          getAllGrades={getAllGrades}
        />
      </Flex>

      {/* Table */}

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Grade Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {grades?.map((grade) => (
            <Table.Row align={"center"} key={grade.id}>
              <Table.RowHeaderCell>{grade.name}</Table.RowHeaderCell>
              <Table.Cell>
                <StatusBadge status={grade.status} />
              </Table.Cell>
              <Table.Cell>
                <Flex gap={"2"}>
                  <GradeDialog
                    title="Update Grade"
                    type="update"
                    buttonIcon={
                      <Pencil2Icon className="cursor-pointer text-slate-500" />
                    }
                    gradeStatus={grade.status}
                    gradeName={grade.name}
                    getAllGrades={getAllGrades}
                    id={grade.id}
                  ></GradeDialog>
                  <Button
                    variant="soft"
                    color="red"
                    onClick={() => deleteGrade(grade.id)}
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

export default GradesPage;
