import prisma from "@/prisma/client";
import { QuizQuestion, QuizQuestionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const quizAttempt = await prisma.quizAttempts.create({
    data: {
      topic_id: parseInt(body.topicId),
      student_id: parseInt(body.studentId),
      score: parseFloat(body.score.toFixed(2)),
    },
  });

  return NextResponse.json({ data: quizAttempt, status: true });
}

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get("topicId");
  const student_id = request.nextUrl.searchParams.get("studentId");

  if (!student_id || !topicId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const quizAttempts = await prisma.quizAttempts.findMany({
    include: {
      topic: {
        include: {
          chapter: true,
        },
      },
    },
    where: {
      topic_id: parseInt(topicId),
      student_id: parseInt(student_id),
    },
  });
  const quizAttemptCount = await prisma.quizAttempts.count({
    where: {
      topic_id: parseInt(topicId),
      student_id: parseInt(student_id),
    },
  });

  return NextResponse.json({
    data: quizAttempts,
    status: true,
    count: quizAttemptCount,
  });
}
