import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: topic, status: true });
}
