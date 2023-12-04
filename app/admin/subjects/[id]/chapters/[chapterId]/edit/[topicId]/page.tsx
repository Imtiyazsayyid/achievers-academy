"use client";
import { topicSchema } from "@/app/validationSchemas";
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
import { CldUploadWidget, CldImage } from "next-cloudinary";

interface Props {
  params: {
    id: string;
    chapterId: string;
    topicId: string;
  };
}

export interface CloudinaryResult {
  url: string;
  public_id: string;
}

const EditTopicPage = ({ params }: Props) => {
  const router = useRouter();
  const [publicId, setPublicId] = useState("");

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
    const validation = topicSchema.safeParse({
      topicName: topicDetails.topicName,
    });

    if (!validation.success) {
      for (let error of validation.error.errors) {
        toast.error(error.message);
      }
      return;
    }

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
    <Flex className="w-full min-h-full py-5">
      <Flex
        direction={"column"}
        p="8"
        className="bg-white border rounded-lg shadow-lg h-full w-full"
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

            <Flex gap={"2"} className="w-1/3" align={"end"}>
              <Flex direction={"column"} className="w-full">
                <Text size={"1"}>PDF</Text>
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
              <Flex className="w-40">
                <CldUploadWidget
                  options={{
                    sources: ["local", "url"],
                    multiple: false,
                    cropping: true,
                    styles: {
                      palette: {
                        window: "#ffffff",
                        sourceBg: "#f4f4f5",
                        windowBorder: "#90a0b3",
                        tabIcon: "#000000",
                        inactiveTabIcon: "#555a5f",
                        menuIcons: "#555a5f",
                        link: "#0433ff",
                        action: "#339933",
                        inProgress: "#0433ff",
                        complete: "#339933",
                        error: "#cc0000",
                        textDark: "#000000",
                        textLight: "#fcfffd",
                      },
                      fonts: {
                        default: null,
                        "sans-serif": {
                          url: null,
                          active: true,
                        },
                      },
                    },
                  }}
                  uploadPreset="oekh1dfb"
                  onUpload={(result) => {
                    if (result.event !== "success") return;
                    const info = result.info as CloudinaryResult;
                    setTopicDetails({
                      ...topicDetails,
                      topicPDFLink: info.url,
                    });
                  }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      className="btn btn-primary w-full"
                      onClick={() => open()}
                    >
                      Upload PDF
                    </Button>
                  )}
                </CldUploadWidget>
              </Flex>
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
