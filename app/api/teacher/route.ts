import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "../helpers/authentication";
import { mailOptions, transporter } from "@/app/email/email";
import WelcomeNewTeacher from "@/app/email/templates/WelcomNewTeacher";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const status = request.nextUrl.searchParams.get("status");

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
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

  const teachers = await prisma.teacher.findMany({
    include: {
      lectureGroups: {
        include: {
          subject: {
            include: {
              board: true,
              grade: true,
            },
          },
        },
      },
    },
    where,
    ...pagination,
  });

  const teacherCount = await prisma.teacher.count({
    where,
  });

  return NextResponse.json({
    data: teachers,
    status: true,
    count: teacherCount,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const body = await request.json();

  if (!body.teacherName && !body.teacherEmail && !body.teacherStatus) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newTeacher = await prisma.teacher.create({
    include: {
      lectureGroups: {
        include: {
          subject: true,
        },
      },
    },
    data: {
      name: body.teacherName,
      email: body.teacherEmail,
      status: body.teacherStatus,
      password: body.teacherPassword,
    },
  });

  if (newTeacher) {
    await transporter.sendMail({
      ...mailOptions,
      to: newTeacher.email,
      subject: "Welcome Aboard Achievers Academy",
      html: WelcomeNewTeacher(
        newTeacher.name,
        newTeacher.email,
        newTeacher.password
      ),
    });
  }

  return NextResponse.json({ data: newTeacher, status: true });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const body = await request.json();

  if (
    !body.teacherName &&
    !body.teacherEmail &&
    !body.teacherStatus &&
    !body.teacherId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedTeacher = await prisma.teacher.update({
    data: {
      name: body.teacherName,
      email: body.teacherEmail,
      status: body.teacherStatus,
      password: body.teacherPassword,
    },
    where: {
      id: body.teacherId,
    },
  });

  return NextResponse.json({ data: updatedTeacher, status: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedTeacher = await prisma.teacher.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedTeacher, status: true });
}
