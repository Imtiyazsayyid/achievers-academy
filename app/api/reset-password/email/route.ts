import { mailOptions, transporter } from "@/app/email/email";
import UserOTPEmail from "@/app/email/templates/UserOTPEmail";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.email)
    return NextResponse.json({
      error: "Please Enter A Valid Email",
      status: false,
    });

  const teacher = await prisma.teacher.findUnique({
    where: {
      email: body.email,
    },
  });

  const student = await prisma.student.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!teacher && !student)
    return NextResponse.json({ error: "User Does Not Exist", status: false });

  const otp = Math.floor(Math.random() * 900000) + 100000;

  const user = teacher ? "teacher" : "student";

  if (teacher) {
    const updatedTeacher = await prisma.teacher.update({
      data: {
        otp: otp.toString(),
      },
      where: {
        id: teacher.id,
      },
    });

    if (updatedTeacher && updatedTeacher.otp) {
      await transporter.sendMail({
        ...mailOptions,
        to: updatedTeacher.email,
        subject: "OTP For Password Change",
        html: UserOTPEmail(updatedTeacher.email, updatedTeacher.otp),
      });
    }
  }

  if (student) {
    const updatedStudent = await prisma.student.update({
      data: {
        otp: otp.toString(),
      },
      where: {
        id: student.id,
      },
    });

    if (updatedStudent && updatedStudent.otp) {
      await transporter.sendMail({
        ...mailOptions,
        to: updatedStudent.email,
        subject: "OTP For Password Change",
        html: UserOTPEmail(updatedStudent.email, updatedStudent.otp),
      });
    }
  }

  return NextResponse.json({ data: { user }, status: true });
}
