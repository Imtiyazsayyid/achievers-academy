"use client";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [error, setError] = useState("");

  const [currentState, setCurrentState] = useState("email");
  const router = useRouter();

  const handleEmailSubmit = async () => {
    const res = await axios.post("/api/reset-password/email", { email });

    if (res.data.status) {
      setError("");
      toast.success("OTP sent on Mail.");
      setUserType(res.data.data.user);
      setCurrentState("otp");
    } else {
      setError(res.data.error);
    }
  };

  const handleOTPSubmit = async () => {
    const res = await axios.post("/api/reset-password/otp", {
      email,
      otp,
      userType,
    });

    if (res.data.status) {
      setError("");
      toast.success("Verification Complete.");
      setCurrentState("reset");
    } else {
      setError(res.data.error);
    }
  };

  const handleNewPasswordSubmit = async () => {
    const res = await axios.post("/api/reset-password/new-password", {
      email,
      otp,
      userType,
      newPassword,
    });

    if (res.data.status) {
      setError("");
      toast.success("Password Changed Successfully");
      router.push("/login");
    } else {
      setError(res.data.error);
    }
  };

  return (
    <Flex
      align={"center"}
      justify={"center"}
      className="h-screen"
      direction={"column"}
      //   style={{
      //     background:
      //       "url('https://images.pexels.com/photos/1586981/pexels-photo-1586981.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      //   }}
    >
      <Flex
        direction={"column"}
        className="border p-10 rounded-lg shadow-md bg-white"
      >
        <Heading mb={"7"}>Reset Password</Heading>
        <Tabs.Root defaultValue={currentState} value={currentState}>
          <Tabs.List>
            <Tabs.Trigger value="email" disabled>
              Email
            </Tabs.Trigger>
            <Tabs.Trigger value="otp" disabled>
              OTP
            </Tabs.Trigger>
            <Tabs.Trigger value="reset" disabled>
              New Password
            </Tabs.Trigger>
          </Tabs.List>

          <Box px="4" pt="3" pb="2">
            <Tabs.Content value="email">
              <Flex className="w-[35rem]" p={"5"} direction={"column"}>
                <Text className="text-xs text-slate-600" mb={"1"}>
                  Email Address
                </Text>
                <TextField.Root size={"3"} className="w-full">
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input onChange={(e) => setEmail(e.target.value)} />
                </TextField.Root>
                <Text className=" text-red-500 text-xs" mt={"1"}>
                  {error}
                </Text>
                <Flex justify={"end"}>
                  <Button mb={"4"} mt={"5"} onClick={handleEmailSubmit}>
                    Get OTP
                  </Button>
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="otp">
              <Flex className="w-[35rem]" p={"5"} direction={"column"}>
                <Text className="text-xs text-slate-600" mb={"1"}>
                  OTP
                </Text>
                <TextField.Root size={"3"} className="w-full">
                  <TextField.Slot>
                    <LockClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input onChange={(e) => setOtp(e.target.value)} />
                </TextField.Root>
                <Text className=" text-red-500 text-xs" mt={"1"}>
                  {error}
                </Text>
                <Flex justify={"end"}>
                  <Button mb={"4"} mt={"5"} onClick={handleOTPSubmit}>
                    Confirm OTP
                  </Button>
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="reset">
              <Flex className="w-[35rem] " p={"5"} direction={"column"}>
                <Text className="text-xs text-slate-600" mb={"1"}>
                  New Password
                </Text>
                <TextField.Root size={"3"} className="w-full">
                  <TextField.Slot>
                    <LockClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Input
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </TextField.Root>
                <Text className=" text-red-500 text-xs" mt={"1"}>
                  {error}
                </Text>
                <Flex justify={"end"}>
                  <Button mb={"4"} mt={"5"} onClick={handleNewPasswordSubmit}>
                    Reset Password
                  </Button>
                </Flex>
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </Flex>
  );
};

export default ResetPasswordPage;
