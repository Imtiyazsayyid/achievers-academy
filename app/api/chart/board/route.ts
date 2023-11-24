import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const studentGroups = await prisma.student.groupBy({
    by: ["board_id"],
    _count: true,
  });

  const dataPromises = studentGroups.map(async (studentGroup) => {
    const board = await prisma.board.findUnique({
      where: {
        id: studentGroup.board_id,
      },
    });
    return { ...studentGroup, board_name: board?.key };
  });

  const data = await Promise.all(dataPromises);

  return NextResponse.json({ data: data, status: true });
}
