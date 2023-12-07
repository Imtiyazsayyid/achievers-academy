"use client";
import {
  ArrowTopRightIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Tabs,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import NotificationBox from "./NotificationBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Notification } from "@prisma/client";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>();
  const { data } = useSession();
  const [currentPage, setCurrentPage] = useState("all");

  const getAllNotifications = async () => {
    if (data?.user.id) {
      const res = await axios.get("/api/notification", {
        params: {
          teacherId: data.user.id,
          isRead:
            currentPage === "read"
              ? "read"
              : currentPage === "unread"
              ? "unread"
              : null,
        },
      });

      console.log(res.data.data);

      setNotifications(res.data.data);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, [data?.user.id, currentPage]);

  return (
    <Flex
      className="min-h-full bg-white w-full border rounded-lg shadow-md mr-5 p-5"
      direction={"column"}
    >
      <Heading my={"3"} mb={"6"} mx={"2"}>
        Notifications
      </Heading>
      <Tabs.Root value={currentPage} className="w-full h-[85%]">
        <Tabs.List>
          <Tabs.Trigger value="all" onClick={() => setCurrentPage("all")}>
            All
          </Tabs.Trigger>
          <Tabs.Trigger value="unread" onClick={() => setCurrentPage("unread")}>
            Unread
          </Tabs.Trigger>
          <Tabs.Trigger value="read" onClick={() => setCurrentPage("read")}>
            Read
          </Tabs.Trigger>
        </Tabs.List>

        <Box
          px="4"
          pt="3"
          pb="2"
          className="h-full bg-slate-100 rounded-b-lg overflow-hidden overflow-y-scroll"
        >
          <Tabs.Content value="all">
            <Flex direction={"column"} gap={"3"}>
              {notifications?.map(
                ({ title, description, id, created_at, is_read }) => (
                  <NotificationBox
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    created_at={created_at}
                    getNotifications={getAllNotifications}
                    is_read={is_read}
                  />
                )
              )}
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="unread">
            <Flex direction={"column"} gap={"3"}>
              {notifications?.map(({ title, description, id, created_at }) => (
                <NotificationBox
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  created_at={created_at}
                  getNotifications={getAllNotifications}
                />
              ))}
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="read">
            <Flex direction={"column"} gap={"3"}>
              {notifications?.map(
                ({ title, description, id, created_at, is_read }) => (
                  <NotificationBox
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    created_at={created_at}
                    getNotifications={getAllNotifications}
                    is_read={is_read}
                  />
                )
              )}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
};

export default NotificationsPage;
