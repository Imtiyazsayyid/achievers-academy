import { Container } from "@radix-ui/themes";
import NavBar from "./NavBar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="h-full bg-white">
        <NavBar />
        <Container className="h-full">
          <Toaster />
          {children}
        </Container>
      </main>
    </>
  );
}
