import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";

async function isAdmin() {
  const session = await getServerSession();
  if (session) {
    console.log({ session });
    const admin_email = session.user.email;
    if (!admin_email) return false;

    const admin = await prisma.admin.findUnique({
      where: {
        email: admin_email,
      },
    });

    console.log({ admin });

    if (admin) return true;
  } else {
    return false;
  }
}

export default isAdmin;
