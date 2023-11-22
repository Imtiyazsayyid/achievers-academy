import { ButtonIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Switch,
  TextField,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import React, { ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { boardSchema } from "@/app/validationSchemas";

interface Props {
  id?: number;
  type: "new" | "update";
  buttonText?: string;
  title: string;
  boardName?: string;
  buttonIcon?: ReactNode;
  boardShortForm?: string;
  boardStatus?: boolean;
  getAllBoards: () => void;
}

const BoardDialog = ({
  id,
  type,
  buttonText,
  title,
  boardName,
  boardShortForm,
  boardStatus,
  buttonIcon,
  getAllBoards,
}: Props) => {
  const [boardDetails, setBoardDetails] = useState({
    boardName,
    boardShortForm,
    boardStatus,
  });

  async function addNewBoard() {
    const res = await axios.post("/api/board", {
      boardName: boardDetails.boardName,
      boardShortForm: boardDetails.boardShortForm,
      boardStatus: boardDetails.boardStatus,
    });

    getAllBoards();

    setBoardDetails({
      boardName: "",
      boardShortForm: "",
      boardStatus: true,
    });

    if (res.data.status) {
      toast.success("Board Added");
    }
  }
  async function updateBoard() {
    let body = {
      boardId: id,
      boardName: boardDetails.boardName,
      boardShortForm: boardDetails.boardShortForm,
      boardStatus: boardDetails.boardStatus,
    };
    const res = await axios.put("/api/board", body);
    if (res.data.status) {
      toast.success("Board Updated");
    }

    getAllBoards();
  }

  const handleSubmit = () => {
    const validation = boardSchema.safeParse({
      boardName: boardDetails.boardName,
      boardShortForm: boardDetails.boardShortForm,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    if (type === "new") {
      addNewBoard();
    }
    if (type === "update") {
      updateBoard();
    }
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
                defaultValue={boardDetails.boardName}
                placeholder="Enter Board Name"
                onChange={(e) =>
                  setBoardDetails({
                    ...boardDetails,
                    boardName: e.target.value,
                  })
                }
                mt={"1"}
              />
            </label>
            <label>
              <TextField.Input
                defaultValue={boardDetails.boardShortForm}
                placeholder="Enter Board Shortform"
                onChange={(e) =>
                  setBoardDetails({
                    ...boardDetails,
                    boardShortForm: e.target.value,
                  })
                }
                mt={"1"}
              />
            </label>
            <label>
              <Flex gap="2" className="border w-fit p-2 shadow-sm rounded-md">
                <Text size={"2"}>Status</Text>{" "}
                <Switch
                  checked={boardDetails.boardStatus}
                  variant="soft"
                  color="green"
                  onCheckedChange={(value) =>
                    setBoardDetails({
                      ...boardDetails,
                      boardStatus: value,
                    })
                  }
                />
              </Flex>
            </label>
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

export default BoardDialog;
