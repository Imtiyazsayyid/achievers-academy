import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const boardId = request.nextUrl.searchParams.get("boardId");
  const gradeId = request.nextUrl.searchParams.get("gradeId");
  const status = request.nextUrl.searchParams.get("status");

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  if (boardId && gradeId) {
    where = {
      ...where,
      subject: {
        board_id: parseInt(boardId),
        grade_id: parseInt(gradeId),
      },
    };
  }

  if (status && status != "all") {
    where = {
      ...where,
      status: status === "active" ? true : false,
    };
  }

  const pageNumber = request.nextUrl.searchParams.get("pageNumber");
  const numberOfItems = request.nextUrl.searchParams.get("numberOfItems");
  let pagination = {};

  if (pageNumber && numberOfItems) {
    pagination = {
      skip: parseInt(pageNumber) * parseInt(numberOfItems),
      take: parseInt(numberOfItems),
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
    ...pagination,
  });

  const lectureGroupCount = await prisma.lectureGroup.count({ where });

  return NextResponse.json({
    data: lectureGroups,
    status: true,
    count: lectureGroupCount,
  });
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
