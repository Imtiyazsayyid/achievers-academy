import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const subjectId = request.nextUrl.searchParams.get("subjectId");

  if (!subjectId)
    return NextResponse.json({ error: "Send All Details", status: false });

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  const chapters = await prisma.chapter.findMany({
    where: {
      subject_id: parseInt(subjectId),
      ...where,
    },
  });

  return NextResponse.json({ data: chapters, status: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.chapterName && !body.chapterShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newChapter = await prisma.chapter.create({
    data: {
      name: body.chapterName,
      status: body.chapterStatus,
      subject_id: parseInt(body.subjectId),
    },
  });

  return NextResponse.json({ data: newChapter, status: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (!body.chapterName && !body.chapterStatus && !body.chapterId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedChapter = await prisma.chapter.update({
    data: {
      name: body.chapterName,
      status: body.chapterStatus,
      subject_id: parseInt(body.subjectId),
    },
    where: {
      id: parseInt(body.chapterId),
    },
  });

  return NextResponse.json({ data: updatedChapter, status: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedChapter = await prisma.chapter.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedChapter, status: true });
}
