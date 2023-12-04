import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "../helpers/authentication";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const subjectId = request.nextUrl.searchParams.get("subjectId");
  const status = request.nextUrl.searchParams.get("status");
  const chapterId = request.nextUrl.searchParams.get("chapterId");

  if (!subjectId)
    return NextResponse.json({ error: "Send All Details", status: false });

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  if (chapterId) {
    where = {
      ...where,
      id: parseInt(chapterId),
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

  if (status && status != "all") {
    where = {
      ...where,
      status: status === "active" ? true : false,
    };
  }

  const chapters = await prisma.chapter.findMany({
    include: {
      topics: true,
    },
    where: {
      subject_id: parseInt(subjectId),
      ...where,
    },
    orderBy: {
      chapter_number: "asc",
    },
    ...pagination,
  });

  const chaptersCount = await prisma.chapter.count({
    where,
  });

  return NextResponse.json({
    data: chapters,
    status: true,
    count: chaptersCount,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  if (!body.chapterName && !body.chapterShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newChapter = await prisma.chapter.create({
    data: {
      name: body.chapterName,
      status: body.chapterStatus,
      subject_id: parseInt(body.subjectId),
      chapter_number: parseInt(body.chapterNumber),
    },
  });

  return NextResponse.json({ data: newChapter, status: true });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  const body = await request.json();

  if (!body.chapterName && !body.chapterStatus && !body.chapterId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedChapter = await prisma.chapter.update({
    data: {
      name: body.chapterName,
      status: body.chapterStatus,
      subject_id: parseInt(body.subjectId),
      chapter_number: parseInt(body.chapterNumber),
    },
    where: {
      id: parseInt(body.chapterId),
    },
  });

  return NextResponse.json({ data: updatedChapter, status: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

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
