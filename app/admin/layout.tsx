import { Container, Flex, useThemeContext } from "@radix-ui/themes";
import NavBar from "./NavBar";
import VerticalNavBar from "./VerticalNavBar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full">
      <Flex className="h-full">
        {/* <NavBar /> */}
        <VerticalNavBar />
        {/* <Container className="h-full"> */}
        <Flex className="w-full h-full py-5" justify={"center"}>
          <Flex className="w-full h-full mx-5" direction={"column"} gap={"2"}>
            <NavBar />
            <Flex className="w-full h-[92%]">{children}</Flex>
          </Flex>
        </Flex>
        {/* </Container> */}
      </Flex>
    </main>
  );
}
