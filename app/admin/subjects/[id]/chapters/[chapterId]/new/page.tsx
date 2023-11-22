"use client";
import {
  Button,
  Card,
  Flex,
  Heading,
  Switch,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import QuizInput from "../components/QuizInput";
import { topicSchema } from "@/app/validationSchemas";

interface Props {
  params: {
    id: string;
    chapterId: string;
  };
}

const NewTopicPage = ({ params }: Props) => {
  const router = useRouter();

  const [topicDetails, setTopicDetails] = useState({
    topicName: "",
    topicVideoLink: "",
    topicPDFLink: "",
    topicDescription: "",
    topicStatus: true,
  });

  const saveTopic = async () => {
    const validation = topicSchema.safeParse({
      topicName: topicDetails.topicName,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

    const res = await axios.post("/api/topic", {
      ...topicDetails,
      chapter_id: params.chapterId,
    });
    if (res.data.status) {
      toast.success("Topic Created");
      router.push(`/admin/subjects/${params.id}/chapters/${params.chapterId}`);
    }
  };

  return (
    <Flex className="min-h-[90vh] w-full">
      <Flex
        direction={"column"}
        m={"9"}
        p="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full overflow-y-scroll"
        gap={"5"}
      >
        <Heading mb={"4"}>Add Topic</Heading>
        <Flex align={"center"} justify={"end"} gap={"2"}>
          <Switch
            checked={topicDetails.topicStatus}
            variant="soft"
            color="green"
            onCheckedChange={(value) =>
              setTopicDetails({
                ...topicDetails,
                topicStatus: value,
              })
            }
          />
        </Flex>
        <Flex gap={"5"} direction={"column"}>
          <Flex gap={"2"}>
            <Flex direction={"column"} gap={"2"} className="w-1/3">
              <Text size={"1"}>Topic Name</Text>
              <TextField.Root>
                <TextField.Input
                  onChange={(e) =>
                    setTopicDetails({
                      ...topicDetails,
                      topicName: e.target.value,
                    })
                  }
                />
              </TextField.Root>
            </Flex>
            <Flex direction={"column"} gap={"2"} className="w-1/3">
              <Text size={"1"}>Video Link</Text>
              <TextField.Root>
                <TextField.Input
                  onChange={(e) =>
                    setTopicDetails({
                      ...topicDetails,
                      topicVideoLink: e.target.value,
                    })
                  }
                />
              </TextField.Root>
            </Flex>
            <Flex direction={"column"} gap={"2"} className="w-1/3">
              <Text size={"1"}>PDF Link</Text>
              <TextField.Root>
                <TextField.Input
                  onChange={(e) =>
                    setTopicDetails({
                      ...topicDetails,
                      topicPDFLink: e.target.value,
                    })
                  }
                />
              </TextField.Root>
            </Flex>
          </Flex>
          <Flex direction={"column"} gap={"2"} className="w-100">
            <Text size={"1"}>Topic Description</Text>
            <TextArea
              className="h-56"
              onChange={(e) =>
                setTopicDetails({
                  ...topicDetails,
                  topicDescription: e.target.value,
                })
              }
            />
          </Flex>

          <Flex justify={"end"}>
            <Button variant="soft" onClick={saveTopic}>
              Save
            </Button>
          </Flex>
        </Flex>

        {/* <QuizInput /> */}
      </Flex>
    </Flex>
  );
};

export default NewTopicPage;
