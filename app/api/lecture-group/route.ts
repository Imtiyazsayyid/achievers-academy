import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "../helpers/authentication";
import { mailOptions, transporter } from "@/app/email/email";
import TeacherAddedToNewLectureGroup from "@/app/email/templates/TeacherAddedToLectureGroup";
import TeacherRemovedFromNewLectureGroup from "@/app/email/templates/TeacherRemovedFromLectureGroup";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const boardId = request.nextUrl.searchParams.get("boardId");
  const gradeId = request.nextUrl.searchParams.get("gradeId");
  const teacherId = request.nextUrl.searchParams.get("teacherId");
  const status = request.nextUrl.searchParams.get("status");
  const filterBoardId = request.nextUrl.searchParams.get("filterBoardId");
  const filterGradeId = request.nextUrl.searchParams.get("filterGradeId");

  if (searchText) {
    where = {
      name: {
        contains: searchText,
      },
    };
  }

  if (boardId && gradeId) {
    where = {
      ...where,
      subject: {
        board_id: parseInt(boardId),
        grade_id: parseInt(gradeId),
      },
    };
  }

  if (filterBoardId && filterBoardId != "all") {
    where = {
      ...where,
      subject: {
        board_id: parseInt(filterBoardId),
      },
    };
  }

  if (filterGradeId && filterGradeId != "all") {
    where = {
      ...where,
      subject: {
        grade_id: parseInt(filterGradeId),
      },
    };
  }

  if (teacherId) {
    where = {
      ...where,
      teacher_id: parseInt(teacherId),
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

  const lectureGroups = await prisma.lectureGroup.findMany({
    include: {
      subject: {
        include: {
          board: true,
          grade: true,
        },
      },
      teacher: true,
      students: true,
    },
    where,
    orderBy: {
      subject: {
        name: "asc",
      },
    },
    ...pagination,
  });

  const lectureGroupCount = await prisma.lectureGroup.count({ where });

  return NextResponse.json({
    data: lectureGroups,
    status: true,
    count: lectureGroupCount,
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  const body = await request.json();

  if (
    !body.subjectId &&
    !body.teacherId &&
    !body.lectureGroupName &&
    body.lectureGroupStatus
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newLectureGroup = await prisma.lectureGroup.create({
    include: {
      teacher: true,
      subject: {
        include: {
          board: true,
          grade: true,
        },
      },
    },
    data: {
      name: body.lectureGroupName,
      subject_id: parseInt(body.subjectId),
      teacher_id: parseInt(body.teacherId),
      status: body.lectureGroupStatus,
    },
  });

  // email

  if (newLectureGroup) {
    await transporter.sendMail({
      ...mailOptions,
      to: newLectureGroup.teacher.email,
      subject: "Lecture Group Assigned",
      html: TeacherAddedToNewLectureGroup(newLectureGroup.teacher.name, {
        name: newLectureGroup.name,
        subject: newLectureGroup.subject,
      }),
    });
  }

  return NextResponse.json({ data: newLectureGroup, status: true });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  const body = await request.json();

  if (
    !body.subjectId &&
    !body.teacherId &&
    !body.lectureGroupName &&
    !body.lectureGroupStatus &&
    !body.lectureGroupId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const previousTeacher = await prisma.lectureGroup.findUnique({
    include: {
      teacher: true,
    },
    where: {
      id: parseInt(body.lectureGroupId),
    },
  });

  const updatedLectureGroup = await prisma.lectureGroup.update({
    include: {
      teacher: true,
      subject: {
        include: {
          grade: true,
          board: true,
        },
      },
    },
    data: {
      name: body.lectureGroupName,
      subject_id: parseInt(body.subjectId),
      teacher_id: parseInt(body.teacherId),
      status: body.lectureGroupStatus,
    },
    where: {
      id: parseInt(body.lectureGroupId),
    },
  });

  // email

  if (updatedLectureGroup) {
    await transporter.sendMail({
      ...mailOptions,
      to: updatedLectureGroup.teacher.email,
      subject: "Lecture Group Assigned",
      html: TeacherAddedToNewLectureGroup(updatedLectureGroup.teacher.name, {
        name: updatedLectureGroup.teacher.name,
        subject: updatedLectureGroup.subject,
      }),
    });
  }

  if (
    previousTeacher &&
    previousTeacher?.teacher_id !== updatedLectureGroup.teacher_id
  ) {
    await transporter.sendMail({
      ...mailOptions,
      to: previousTeacher?.teacher.email,
      subject: "Lecture Group Unassigned",
      html: TeacherRemovedFromNewLectureGroup(previousTeacher.name, {
        name: updatedLectureGroup.teacher.name,
        subject: updatedLectureGroup.subject,
      }),
    });
  }

  return NextResponse.json({ data: updatedLectureGroup, status: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedLectureGroup = await prisma.lectureGroup.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedLectureGroup, status: true });
}
