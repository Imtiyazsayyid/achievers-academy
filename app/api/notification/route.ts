import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const teacherId = request.nextUrl.searchParams.get("teacherId");
  const isRead = request.nextUrl.searchParams.get("isRead");

  if (isRead != null) {
    where = {
      ...where,
      is_read: isRead === "unread" ? false : true,
    };
  }

  if (!teacherId)
    return NextResponse.json({
      error: "Send Techer Id",
      status: false,
    });

  const notifications = await prisma.notification.findMany({
    where: {
      to_teacher_id: parseInt(teacherId),
      ...where,
    },
  });

  let notificationCount = await prisma.notification.count({
    where: {
      to_teacher_id: parseInt(teacherId),
      ...where,
    },
  });

  console.log({ notifications });

  return NextResponse.json({
    data: notifications,
    status: true,
    count: notificationCount,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const notification = await prisma.notification.create({
    data: {
      title: body.title,
      description: body.description,
      to_teacher_id: body.to_teacher_id,
      to_student_id: body.to_student_id,
    },
  });

  return NextResponse.json({
    data: notification,
    status: true,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (!body.id)
    return NextResponse.json({
      error: "Send Notification Id",
      status: false,
    });

  const notification = await prisma.notification.update({
    data: {
      is_read: true,
    },
    where: {
      id: parseInt(body.id),
    },
  });

  return NextResponse.json({
    data: notification,
    status: true,
  });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({
      error: "Send Notification Id",
      status: false,
    });

  const notification = await prisma.notification.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({
    data: notification,
    status: true,
  });
}
