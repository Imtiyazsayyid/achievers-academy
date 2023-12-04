import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const checkStudentAuth = () => {
  const router = useRouter();
  const { status, data } = useSession();

  if (status === "loading") return;

  if (status === "unauthenticated" || data?.user.role !== "student")
    router.push("/login");
};

export default checkStudentAuth;
