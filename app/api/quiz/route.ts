import prisma from "@/prisma/client";
import { QuizQuestion, QuizQuestionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const topicId = request.nextUrl.searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const quizQuestions = await prisma.quizQuestion.findMany({
    where: {
      topic_id: parseInt(topicId),
    },
    include: {
      options: true,
    },
  });

  return NextResponse.json({ data: quizQuestions, status: true });
}

interface QuestionFormat {
  id: number;
  question: string;
  type: QuizQuestionType;
  options: QuestionOptionFormat[];
  correctOption: number;
}

interface QuestionOptionFormat {
  id: number;
  text: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const questionList = body.questions;

  // find question ids

  const allCurrentQuestions = await prisma.quizQuestion.findMany({
    where: {
      topic_id: parseInt(body.topicId),
    },
  });

  // delete options using question ids

  for (let question of allCurrentQuestions) {
    await prisma.quizQuestionOption.deleteMany({
      where: {
        quiz_question_id: question.id,
      },
    });
  }

  // delete questions using topic id

  await prisma.quizQuestion.deleteMany({
    where: {
      topic_id: parseInt(body.topicId),
    },
  });

  // add new questions for topic

  for (let question of questionList) {
    const newQuestion = await prisma.quizQuestion.create({
      data: {
        topic_id: parseInt(body.topicId),
        question: question.question,
        type: question.type,
        correctAnswer: question.correctAnswer,
        correctOption:
          question.type == "MULTIPLE_CHOICE" ? question.correctOption : null,
      },
    });
    if (question.type == "MULTIPLE_CHOICE") {
      for (let option of question.options) {
        await prisma.quizQuestionOption.create({
          data: {
            text: option.text,
            quiz_question_id: newQuestion.id,
            option_number: option.id,
          },
        });
      }
    }
  }

  return NextResponse.json({ data: questionList, status: true });
}

// export async function PUT(request: NextRequest) {
//   const body = await request.json();

//   if (
//     !body.gradeName &&
//     !body.gradeShortForm &&
//     !body.gradeStatus &&
//     !body.gradeId
//   ) {
//     return NextResponse.json({ error: "Send All Details", status: false });
//   }

//   const updatedGrade = await prisma.grade.update({
//     data: {
//       name: body.gradeName,
//       status: body.gradeStatus,
//     },
//     where: {
//       id: parseInt(body.gradeId),
//     },
//   });

//   return NextResponse.json({ data: updatedGrade, status: true });
// }

// export async function DELETE(request: NextRequest) {
//   const id = request.nextUrl.searchParams.get("id");
//   if (!id) {
//     return NextResponse.json({ error: "Send All Details", status: false });
//   }

//   const deletedGrade = await prisma.grade.delete({
//     where: {
//       id: parseInt(id),
//     },
//   });

//   return NextResponse.json({ data: deletedGrade, status: true });
// }
