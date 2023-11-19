import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const studentId = request.nextUrl.searchParams.get("studentId");

  if (!studentId)
    return NextResponse.json({ error: "Send All Details", status: false });

  if (searchText) {
    where = {
      subject: {
        name: {
          contains: searchText,
        },
      },
    };
  }

  const subjects = await prisma.studentSubjectMapper.findMany({
    include: {
      subject: true,
    },
    where: {
      student_id: parseInt(studentId),
      ...where,
    },
  });

  return NextResponse.json({ data: subjects, status: true });
}
