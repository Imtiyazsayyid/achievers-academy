import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const checkTeacherAuth = () => {
  const router = useRouter();
  const { status, data } = useSession();

  if (status === "loading") return;

  if (status == "unauthenticated" || data?.user.role !== "teacher")
    router.push("/login");
};

export default checkTeacherAuth;
