import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (
    !body.email ||
    (body.userType !== "student" && body.userType !== "teacher")
  )
    return NextResponse.json({
      error: "Please Enter A Valid Email",
      status: false,
    });

  if (!body.otp)
    return NextResponse.json({
      error: "Please Enter A Valid OTP",
      status: false,
    });

  if (body.userType === "student") {
    const student = await prisma.student.findUnique({
      where: {
        email: body.email,
      },
    });

    if (student?.otp === body.otp) {
      return NextResponse.json({ data: "Success", status: true });
    }
  } else if (body.userType === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: {
        email: body.email,
      },
    });
    if (teacher?.otp === body.otp) {
      return NextResponse.json({ data: "Success", status: true });
    }
  }

  return NextResponse.json({ error: "Invalid OTP", status: false });
}
