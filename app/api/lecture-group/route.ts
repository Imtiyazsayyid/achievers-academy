import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  const lectureGroups = await prisma.lectureGroup.findMany({
    include: {
      subject: {
        include: {
          board: true,
          grade: true,
        },
      },
      teacher: true,
      students: true,
    },
    where,
    orderBy: {
      subject: {
        name: "asc",
      },
    },
  });

  return NextResponse.json({ data: lectureGroups, status: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (
    !body.subjectId &&
    !body.teacherId &&
    !body.lectureGroupName &&
    body.lectureGroupStatus
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newBoard = await prisma.lectureGroup.create({
    data: {
      name: body.lectureGroupName,
      subject_id: parseInt(body.subjectId),
      teacher_id: parseInt(body.teacherId),
      status: body.lectureGroupStatus,
    },
  });

  return NextResponse.json({ data: newBoard, status: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (
    !body.subjectId &&
    !body.teacherId &&
    !body.lectureGroupName &&
    !body.lectureGroupStatus &&
    !body.lectureGroupId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedBoard = await prisma.lectureGroup.update({
    data: {
      name: body.lectureGroupName,
      subject_id: parseInt(body.subjectId),
      teacher_id: parseInt(body.teacherId),
      status: body.lectureGroupStatus,
    },
    where: {
      id: parseInt(body.lectureGroupId),
    },
  });

  return NextResponse.json({ data: updatedBoard, status: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedLectureGroup = await prisma.lectureGroup.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedLectureGroup, status: true });
}
