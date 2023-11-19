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
