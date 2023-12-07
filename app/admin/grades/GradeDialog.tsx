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
import { gradeSchema } from "@/app/validationSchemas";

interface Props {
  id?: number;
  type: "new" | "update";
  buttonText?: string;
  title: string;
  gradeName?: string;
  buttonIcon?: ReactNode;
  gradeStatus?: boolean;
  getAllGrades: () => void;
}

const GradeDialog = ({
  id,
  type,
  buttonText,
  title,
  gradeName,
  gradeStatus,
  buttonIcon,
  getAllGrades,
}: Props) => {
  const [gradeDetails, setGradeDetails] = useState({
    gradeName,
    gradeStatus,
  });

  async function addNewGrade() {
    const res = await axios.post("/api/grade", {
      gradeName: gradeDetails.gradeName,
      gradeStatus: gradeDetails.gradeStatus,
    });

    getAllGrades();

    setGradeDetails({
      gradeName: "",
      gradeStatus: true,
    });

    if (res.data.status) {
      toast.success("Grade Added");
    }
  }
  async function updateGrade() {
    let body = {
      gradeId: id,
      gradeName: gradeDetails.gradeName,
      gradeStatus: gradeDetails.gradeStatus,
    };
    const res = await axios.put("/api/grade", body);
    if (res.data.status) {
      toast.success("Grade Updated");
    }

    getAllGrades();
  }

  const handleSubmit = () => {
    const validation = gradeSchema.safeParse({
      gradeName: gradeDetails.gradeName,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    if (type === "new") {
      addNewGrade();
    }
    if (type === "update") {
      updateGrade();
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

          <Flex direction="column" gap="3" mt={"6"}>
            <label>
              <TextField.Input
                defaultValue={gradeDetails.gradeName}
                placeholder="Enter Grade Name"
                onChange={(e) =>
                  setGradeDetails({
                    ...gradeDetails,
                    gradeName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <Flex gap="2" className="border w-fit p-2 shadow-sm rounded-md">
                <Text size={"2"}>Status</Text>{" "}
                <Switch
                  checked={gradeDetails.gradeStatus}
                  variant="soft"
                  color="green"
                  onCheckedChange={(value) =>
                    setGradeDetails({
                      ...gradeDetails,
                      gradeStatus: value,
                    })
                  }
                />
              </Flex>
            </label>
          </Flex>

          <Flex gap="3" mt="6" justify="end">
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

export default GradeDialog;
