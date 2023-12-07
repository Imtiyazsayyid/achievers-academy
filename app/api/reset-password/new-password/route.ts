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

  if (!body.newPassword)
    return NextResponse.json({
      error: "Please Enter A New Password",
      status: false,
    });

  // student

  if (body.userType === "student") {
    const studentVerify = await prisma.student.findUnique({
      where: {
        email: body.email,
      },
    });

    if (studentVerify?.otp === body.otp) {
      const student = await prisma.student.update({
        data: {
          otp: null,
          password: body.newPassword,
        },
        where: {
          email: body.email,
        },
      });

      if (student) return NextResponse.json({ data: "Success", status: true });
    }
  }

  // teacher
  else if (body.userType === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: {
        email: body.email,
      },
    });
    if (teacher?.otp === body.otp) {
      const teacher = await prisma.teacher.update({
        data: {
          password: body.newPassword,
          otp: null,
        },
        where: {
          email: body.email,
        },
      });
      if (teacher) {
        return NextResponse.json({ data: "Success", status: true });
      }
    }
  }
  return NextResponse.json({ data: "Some Error Has Occured", status: false });
}
