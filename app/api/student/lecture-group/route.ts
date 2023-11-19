import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const lectureGroupId = request.nextUrl.searchParams.get("lectureGroupId");

  if (!lectureGroupId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  if (searchText) {
    where = {
      student: {
        name: {
          contains: searchText,
        },
      },
    };
  }

  const StudentLectureGroup = await prisma.studentLectureGroupMapper.findMany({
    include: {
      student: true,
    },
    where: {
      lecture_group_id: parseInt(lectureGroupId),
      ...where,
    },
  });

  return NextResponse.json({ data: StudentLectureGroup, status: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedStudentLectureGroup =
    await prisma.studentLectureGroupMapper.delete({
      where: {
        id: parseInt(id),
      },
    });

  return NextResponse.json({ data: deletedStudentLectureGroup, status: true });
}
