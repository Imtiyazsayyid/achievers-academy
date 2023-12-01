import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Props) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: teacher, status: true });
}
