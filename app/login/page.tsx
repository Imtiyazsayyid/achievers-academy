"use client";

import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { status, data } = useSession();

  function authoriseUser() {
    if (status === "authenticated" && data?.user?.role) {
      router.push(`/${data.user.role}`);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    const validation = await signIn("credentials", {
      email: userDetails.email,
      password: userDetails.password,
      redirect: false,
    });

    if (validation?.error) {
      setInvalidCredentials(true);
      return;
    }

    setUserDetails({
      email: "",
      password: "",
    });
  }

  useEffect(() => {
    authoriseUser();
  }, [status, data]);

  return (
    <Flex className="h-full">
      <Flex className="w-3/5">
        <img
          src="https://images.pexels.com/photos/2546035/pexels-photo-2546035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          className="object-cover w-full"
        />
      </Flex>
      <Flex
        className="w-2/5 p-10"
        direction={"column"}
        justify={"center"}
        align={"center"}
        gap={"5"}
      >
        <Heading>Welcome To Achievers Academy</Heading>
        {invalidCredentials && (
          <p className="text-sm text-red-400 text-center py-1">
            Invalid Credentials.
          </p>
        )}
        <Flex
          className="w-full h-fit rounded-lg p-10 shadow-md bg-white"
          direction={"column"}
          gap={"2"}
        >
          <TextField.Root size={"3"}>
            <TextField.Slot>
              <EnvelopeClosedIcon height="16" width="16" />
            </TextField.Slot>
            <TextField.Input
              placeholder="Email"
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
          </TextField.Root>
          <TextField.Root size={"3"}>
            <TextField.Slot>
              <LockClosedIcon height="16" width="16" />
            </TextField.Slot>
            <TextField.Input
              placeholder="Password"
              type="password"
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
            />
          </TextField.Root>
          <Text
            className="text-xs text-slate-500 hover:text-[var(--violet-a11)] cursor-pointer"
            onClick={() => router.push("/reset-password")}
          >
            Forgot Password?
          </Text>
          <Button mt={"5"} size={"2"} onClick={handleLogin}>
            Log In
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
