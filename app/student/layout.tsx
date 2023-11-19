import { Container } from "@radix-ui/themes";
import NavBar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <NavBar />
        <Container className="h-full">{children}</Container>
      </main>
    </>
  );
}
