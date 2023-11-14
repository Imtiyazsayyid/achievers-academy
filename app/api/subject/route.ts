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

  const subjects = await prisma.subject.findMany({
    where,
    include: {
      board: true,
      grade: true,
    },
  });

  return NextResponse.json({ data: subjects, status: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.subjectName && !body.subjectShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newSubject = await prisma.subject.create({
    data: {
      name: body.subjectName,
      key: body.subjectShortForm,
      status: body.subjectStatus,
      grade_id: parseInt(body.gradeId),
      board_id: parseInt(body.boardId),
    },
  });

  return NextResponse.json({ data: newSubject, status: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (
    !body.subjectName &&
    !body.subjectShortForm &&
    !body.subjectStatus &&
    !body.subjectId &&
    !body.gradeId &&
    !body.boardId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  console.log({ body });

  const updatedSubject = await prisma.subject.update({
    data: {
      name: body.subjectName,
      key: body.subjectShortForm,
      status: body.subjectStatus,
      grade_id: parseInt(body.gradeId),
      board_id: parseInt(body.boardId),
    },
    where: {
      id: parseInt(body.subjectId),
    },
  });

  return NextResponse.json({ data: updatedSubject, status: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }
  const deletedSubject = await prisma.subject.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedSubject, status: true });
}
