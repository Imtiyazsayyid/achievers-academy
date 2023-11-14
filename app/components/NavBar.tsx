import { Container, Flex } from "@radix-ui/themes";
import React from "react";
import { GiPirateHook } from "react-icons/gi";

const NavBar = () => {
  return (
    <Flex className="h-14 border-b">
      <Container>
        <Flex className="h-14 border-b">
          <Flex className="w-1/5 border" align={"center"} justify={"center"}>
            <GiPirateHook />
          </Flex>
          <Flex className="w-3/5 border"></Flex>
          <Flex className="w-1/5 border"></Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default NavBar;
