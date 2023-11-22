"use client";
import { Topic } from "@prisma/client";
import {
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Switch,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PDFViewer from "pdf-viewer-reactjs";

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

  return (
    <Flex className="min-h-[90vh] w-full" direction={"column"}>
      <Flex
        direction={"column"}
        m={"9"}
        p="8"
        className="bg-white border rounded-lg shadow-lg min-h-[full] w-full overflow-hidden overflow-y-scroll"
      >
        <Heading align={"center"} mb={"5"}>
          {topicDetails.topicName}
        </Heading>

        <Flex gap={"5"} direction={"column"} align={"center"}>
          <Separator my="3" size="4" />
          <Flex className="h-96">
            <video
              src={topicDetails?.topicVideoLink}
              controls
              className="rounded-xl h-full"
            />
          </Flex>
          <Separator my="3" size="4" />

          <Flex direction={"column"} align={"center"}>
            <a
              href={topicDetails.topicPDFLink}
              target="_blank"
              className="h-40 w-40 border rounded-lg"
            >
              <img src="https://www.shareicon.net/download/2017/06/14/887051_pdf_512x512.png" />
            </a>
          </Flex>

          <Separator my="3" size="4" />

          {topicDetails.topicDescription && (
            <>
              <Flex className="border p-5 mx-10 rounded-lg" justify={"center"}>
                <Text className="text-sm text-slate-600 text-center">
                  {topicDetails.topicDescription}
                </Text>
              </Flex>
              <Separator my="3" size="4" />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EditTopicPage;
