import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const studentGroups = await prisma.student.groupBy({
    by: ["grade_id"],
    _count: true,
  });

  const dataPromises = studentGroups.map(async (studentGroup) => {
    const grade = await prisma.grade.findUnique({
      where: {
        id: studentGroup.grade_id,
      },
    });
    return { ...studentGroup, board_name: grade?.name };
  });

  const data = await Promise.all(dataPromises);

  return NextResponse.json({ data: data, status: true });
}
