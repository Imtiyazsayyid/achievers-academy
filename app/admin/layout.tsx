import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./NavBar";
import VerticalNavBar from "./VerticalNavBar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full">
      <Flex className="h-full border">
        {/* <NavBar /> */}
        <VerticalNavBar />
        {/* <Container className="h-full"> */}
        <Flex className="w-full" justify={"center"}>
          <Flex className="w-[85%]">
            <Toaster />
            {children}
          </Flex>
        </Flex>
        {/* </Container> */}
      </Flex>
    </main>
  );
}
