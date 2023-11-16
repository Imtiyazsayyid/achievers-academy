import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

const GoBack = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Flex>
      <ArrowLeftIcon
        onClick={() => router.back()}
        className={
          "border h-8 w-8 p-2 rounded-full bg-[var(--violet-a4)] text-[var(--violet-a11)]" +
          className
        }
      />
    </Flex>
  );
};

export default GoBack;
