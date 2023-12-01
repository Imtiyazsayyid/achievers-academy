import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const topic = await prisma.topic.findUnique({
    include: {
      students_completed_topic: true,
    },
    where: {
      id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: topic, status: true });
}

// add completed topic
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const completedTopic = await prisma.completedTopics.create({
    data: {
      student_id: parseInt(body.studentId),
      topic_id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: completedTopic, status: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const student_id = request.nextUrl.searchParams.get("student_id");

  if (!student_id)
    return NextResponse.json({ error: "Send All Details", status: "false" });

  const completedTopic = await prisma.completedTopics.deleteMany({
    where: {
      student_id: parseInt(student_id),
      topic_id: parseInt(params.id),
    },
  });

  return NextResponse.json({ data: completedTopic, status: true });
}
