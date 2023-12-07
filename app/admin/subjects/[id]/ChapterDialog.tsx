"use client";
import { chapterSchema } from "@/app/validationSchemas";
import { Board, Grade } from "@prisma/client";
import {
  Button,
  Dialog,
  Flex,
  Switch,
  TextField,
  Text,
  Select,
} from "@radix-ui/themes";
import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  id?: number;
  type: "new" | "update";
  buttonText?: string;
  title: string;
  chapterName?: string;
  buttonIcon?: ReactNode;
  chapterStatus?: boolean;
  chapterNumber?: number;
  subjectId: string;
  getAllChapters: () => void;
}

const ChapterDialog = ({
  id,
  type,
  buttonText,
  title,
  chapterName,
  chapterStatus,
  buttonIcon,
  subjectId,
  chapterNumber,
  getAllChapters,
}: Props) => {
  const [chapterDetails, setChapterDetails] = useState({
    chapterName: chapterName,
    chapterStatus: chapterStatus,
    subjectId: subjectId,
    chapterNumber: chapterNumber,
  });

  async function addNewChapter() {
    const res = await axios.post("/api/chapter", {
      chapterName: chapterDetails.chapterName,
      chapterStatus: chapterDetails.chapterStatus,
      subjectId: chapterDetails.subjectId,
      chapterNumber: chapterDetails.chapterNumber,
    });

    clearForm();
    getAllChapters();

    if (res.data.status) {
      toast.success("Chapter Added");
    }
  }
  async function updateChapter() {
    let body = {
      chapterId: id,
      subjectId: chapterDetails.subjectId,
      chapterName: chapterDetails.chapterName,
      chapterStatus: chapterDetails.chapterStatus,
      chapterNumber: chapterDetails.chapterNumber,
    };

    const res = await axios.put("/api/chapter", body);
    if (res.data.status) {
      toast.success("Chapter Updated");
    }

    getAllChapters();
  }

  const handleSubmit = () => {
    const validation = chapterSchema.safeParse({
      chapterName: chapterDetails.chapterName,
      chapterNumber: chapterDetails.chapterNumber,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }
    if (type === "new") {
      addNewChapter();
    }
    if (type === "update") {
      updateChapter();
    }
  };

  const clearForm = () => {
    setChapterDetails({
      chapterName: "",
      chapterStatus: true,
      subjectId: subjectId,
      chapterNumber: chapterDetails.chapterNumber
        ? chapterDetails.chapterNumber + 1
        : chapterDetails.chapterNumber,
    });
  };

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size={"2"} variant="soft">
            {buttonIcon}
            {buttonText}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>{title}</Dialog.Title>

          <Flex direction="column" gap="3">
            <label>
              <TextField.Input
                defaultValue={chapterDetails.chapterName}
                placeholder="Enter Chapter Name"
                onChange={(e) =>
                  setChapterDetails({
                    ...chapterDetails,
                    chapterName: e.target.value,
                  })
                }
              />
            </label>

            <Flex align={"end"} gap={"3"}>
              <Flex direction={"column"} gap={"1"} className="w-2/3">
                <Text size={"1"}>Chapter Number</Text>
                <TextField.Input
                  defaultValue={chapterDetails.chapterNumber}
                  placeholder="Enter Chapter number"
                  onChange={(e) =>
                    setChapterDetails({
                      ...chapterDetails,
                      chapterNumber: parseInt(e.target.value),
                    })
                  }
                />
              </Flex>
              <label className="w-1/3">
                <Flex
                  gap="2"
                  className="border w-fit p-2 shadow-sm rounded-md "
                >
                  <Text size={"1"}>Status</Text>{" "}
                  <Switch
                    checked={chapterDetails.chapterStatus}
                    variant="soft"
                    color="green"
                    size={"1"}
                    onCheckedChange={(value) =>
                      setChapterDetails({
                        ...chapterDetails,
                        chapterStatus: value,
                      })
                    }
                  />
                </Flex>
              </label>
            </Flex>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleSubmit}>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default ChapterDialog;
