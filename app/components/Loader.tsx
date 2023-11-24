import { Flex } from "@radix-ui/themes";
import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Flex className="w-full h-96" justify={"center"} align={"center"}>
      <ScaleLoader
        color={"var(--violet-a11)"}
        loading={isLoading}
        aria-label="Loading Spinner"
        data-testid="loader"
        height={20}
      />
    </Flex>
  );
};

export default Loader;
