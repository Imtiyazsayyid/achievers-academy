"use client";
import { Topic } from "@prisma/client";
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  params: {
    id: string;
    chapterId: string;
    topicId: string;
  };
}

const EditTopicPage = ({ params }: Props) => {
  const router = useRouter();

  const getSingleTopic = async () => {
    const res = await axios.get("/api/topic", {
      params: {
        topicId: params.topicId,
        chapterId: params.chapterId,
      },
    });

    const data = res.data.data[0];
    setTopicDetails({
      topicName: data.name,
      topicVideoLink: data.video,
      topicPDFLink: data.pdf,
      topicDescription: data.description,
      topicStatus: data.status,
    });
  };

  useEffect(() => {
    getSingleTopic();
  }, []);

  const [topicDetails, setTopicDetails] = useState({
    topicName: "",
    topicVideoLink: "",
    topicPDFLink: "",
    topicDescription: "",
    topicStatus: true,
  });

  const updateTopic = async () => {
    const res = await axios.put("/api/topic", {
      ...topicDetails,
      chapter_id: params.chapterId,
      topicId: params.topicId,
    });
    if (res.data.status) {
      toast.success("Topic Updated");
      setTopicDetails({
        topicName: "",
        topicVideoLink: "",
        topicPDFLink: "",
        topicDescription: "",
        topicStatus: true,
      });
      router.push(`/admin/subjects/${params.id}/chapters/${params.chapterId}`);
    }
  };

  return (
    <Flex className="h-[90vh] w-full">
      <Flex
        direction={"column"}
        m={"9"}
        p="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full"
      >
        <Heading mb={"8"}>Add Topic</Heading>
        <Flex gap={"5"} direction={"column"}>
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
          <Flex gap={"2"}>
            <Flex direction={"column"} gap={"2"} className="w-1/3">
              <Text size={"1"}>Topic Name</Text>
              <TextField.Root>
                <TextField.Input
                  defaultValue={topicDetails.topicName}
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
                  defaultValue={topicDetails.topicVideoLink}
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
                  defaultValue={topicDetails.topicPDFLink}
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
              defaultValue={topicDetails.topicDescription}
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
            <Button variant="soft" onClick={updateTopic}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EditTopicPage;
