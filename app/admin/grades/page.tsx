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
import GoBack from "@/app/components/GoBack";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import StatusFilter from "@/app/components/filters/StatusFilter";

const GradesPage = () => {
  const [grades, setGrades] = useState<Grade[]>();
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("all");

  const getAllGrades = async () => {
    const res = await axios.get("/api/grade", {
      params: {
        searchText,
        status,
      },
    });
    setGrades(res.data.data);
  };

  const deleteGrade = async (id: number) => {
    try {
      const res = await axios.delete("/api/grade", {
        params: {
          id,
        },
      });

      if (res.data.status) {
        toast.success("Grade Deleted");
      }
      getAllGrades();
    } catch (error) {
      toast.error("Some Items are still using this.");
    }
  };

  useEffect(() => {
    getAllGrades();
  }, [searchText, status]);

  return (
    <Flex className="w-full min-h-full mr-5">
      <Flex
        direction={"column"}
        p="5"
        px="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <Heading mb={"6"} mt="5">
          Grades
        </Heading>
        <Flex justify={"between"} mb={"2"} align={"end"}>
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
            <GradeDialog
              title="Add Grade"
              gradeStatus={true}
              buttonIcon={<PlusIcon />}
              buttonText={"Add New"}
              type="new"
              getAllGrades={getAllGrades}
            />
          </Flex>
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
                    {/* <Button
                      variant="soft"
                      color="red"
                      onClick={() => deleteGrade(grade.id)}
                    >
                      <TrashIcon />
                    </Button> */}
                    <DeleteConfirmation
                      itemToBeDeletedName={grade.name}
                      itemToBeDeletedType="Grade"
                      confirmDelete={() => deleteGrade(grade.id)}
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

export default GradesPage;
