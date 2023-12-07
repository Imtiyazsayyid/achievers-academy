import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "../helpers/authentication";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const chapter_id = request.nextUrl.searchParams.get("chapterId");
  const topicId = request.nextUrl.searchParams.get("topicId");
  const status = request.nextUrl.searchParams.get("status");

  if (!chapter_id)
    return NextResponse.json({ error: "Send All Details", status: false });

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  if (topicId) {
    where = {
      ...where,
      id: parseInt(topicId),
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

  const topics = await prisma.topic.findMany({
    include: {
      students_completed_topic: true,
    },
    where: {
      chapter_id: parseInt(chapter_id),
      ...where,
    },
    ...pagination,
  });

  const topicCount = await prisma.topic.count({
    where,
  });

  return NextResponse.json({ data: topics, status: true, count: topicCount });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const body = await request.json();

  if (!body.topicName && !body.topicShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newTopic = await prisma.topic.create({
    data: {
      name: body.topicName,
      status: body.topicStatus,
      chapter_id: parseInt(body.chapter_id),
      description: body.topicDescription,
      video: body.topicVideoLink,
      pdf: body.topicPdfLink,
    },
  });

  return NextResponse.json({ data: newTopic, status: true });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const body = await request.json();

  if (!body.topicName && !body.topicStatus) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedTopic = await prisma.topic.update({
    data: {
      name: body.topicName,
      status: body.topicStatus,
      chapter_id: parseInt(body.chapter_id),
      description: body.topicDescription,
      video: body.topicVideoLink,
      pdf: body.topicPDFLink,
    },
    where: {
      id: parseInt(body.topicId),
    },
  });

  return NextResponse.json({ data: updatedTopic, status: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const topicQuizQuestions = await prisma.quizQuestion.findMany({
    where: {
      topic_id: parseInt(id),
    },
  });

  for (let topicQuizQuestion of topicQuizQuestions) {
    await prisma.quizQuestionOption.deleteMany({
      where: {
        quiz_question_id: topicQuizQuestion.id,
      },
    });
  }

  await prisma.quizQuestion.deleteMany({
    where: {
      topic_id: parseInt(id),
    },
  });

  const deletedTopic = await prisma.topic.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedTopic, status: true });
}
