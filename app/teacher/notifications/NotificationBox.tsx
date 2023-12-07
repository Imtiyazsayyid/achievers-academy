import {
  ArrowTopRightIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Flex, Heading, Text, Tooltip } from "@radix-ui/themes";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface Props {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  is_read?: boolean;
  getNotifications: () => void;
}

const NotificationBox = ({
  id,
  title,
  description,
  created_at,
  is_read,
  getNotifications,
}: Props) => {
  const router = useRouter();

  const markRead = async () => {
    const res = await axios.put("/api/notification", {
      id,
    });

    if (res.data.status) {
      toast.success("Marked As Read");
      getNotifications();
    }
  };

  const deleteNotification = async () => {
    const res = await axios.delete("/api/notification", {
      params: {
        id,
      },
    });

    if (res.data.status) {
      toast.success("Notification Deleted");
      getNotifications();
    }
  };

  return (
    <Flex className="rounded-lg shadow-md border bg-white">
      <Flex direction={"column"} p={"5"} className="w-4/6">
        <Heading size={"2"} mb={"1"}>
          {title}
        </Heading>
        <Text className="text-xs text-slate-700" mb={"4"}>
          {description}
        </Text>
      </Flex>
      <Flex className="w-1/6" align={"center"} justify={"center"}>
        <Text className="text-xs text-slate-400">
          {moment(created_at).format("hh:mm A MMM DD, YYYY")}
        </Text>
      </Flex>
      <Flex className="w-1/6" align={"center"} justify={"center"} gap={"3"}>
        {!is_read && (
          <Tooltip content="Mark As Read">
            <Flex
              className="rounded-full p-2 bg-[var(--green-a3)] cursor-pointer"
              onClick={markRead}
            >
              <CheckIcon color="green" />
            </Flex>
          </Tooltip>
        )}
        <Tooltip content="Clear">
          <Flex
            className="rounded-full p-2 bg-[var(--red-a3)] cursor-pointer"
            onClick={deleteNotification}
          >
            <Cross2Icon color="red" />
          </Flex>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default NotificationBox;
