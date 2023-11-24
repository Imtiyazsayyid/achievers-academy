import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Props) {
  const admin = await prisma.admin.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: admin, status: true });
}
