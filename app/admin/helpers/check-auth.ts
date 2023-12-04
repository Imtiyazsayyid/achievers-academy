import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const checkAdminAuth = () => {
  const router = useRouter();
  const { status, data } = useSession();

  if (status === "loading") return;

  if (status == "unauthenticated" || data?.user.role !== "admin")
    router.push("/login");
};

export default checkAdminAuth;
