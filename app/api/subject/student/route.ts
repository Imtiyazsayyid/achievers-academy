import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const studentId = request.nextUrl.searchParams.get("studentId");
  const onlyActive = request.nextUrl.searchParams.get("onlyActive");

  if (!studentId)
    return NextResponse.json({ error: "Send All Details", status: false });

  if (searchText) {
    where = {
      subject: {
        status: true,
        name: {
          contains: searchText,
        },
      },
    };
  }

  if (onlyActive) {
    where = {
      ...where,
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
