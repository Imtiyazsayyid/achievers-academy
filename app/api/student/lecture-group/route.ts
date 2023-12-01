import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let where: any = {};

  const searchText = request.nextUrl.searchParams.get("searchText");
  const lectureGroupId = request.nextUrl.searchParams.get("lectureGroupId");
  const status = request.nextUrl.searchParams.get("status");

  if (!lectureGroupId) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  if (searchText) {
    where = {
      student: {
        name: {
          contains: searchText,
        },
      },
    };
  }

  const pageNumber = request.nextUrl.searchParams.get("pageNumber");
  const numberOfItems = request.nextUrl.searchParams.get("numberOfItems");
  let pagination = {};

  if (pageNumber && numberOfItems) {
    pagination = {
      skip: parseInt(pageNumber) * parseInt(numberOfItems),
      take: 7,
    };
  }

  if (status && status != "all") {
    where = {
      ...where,
      status: status === "active" ? true : false,
    };
  }

  const StudentLectureGroup = await prisma.studentLectureGroupMapper.findMany({
    include: {
      student: true,
      lecture_group: {
        include: {
          subject: {
            include: {
              chapters: {
                include: {
                  topics: {
                    include: {
                      students_completed_topic: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: {
      lecture_group_id: parseInt(lectureGroupId),
      ...where,
    },
    ...pagination,
  });

  const StudentLectureGroupCount = await prisma.studentLectureGroupMapper.count(
    {
      where: {
        lecture_group_id: parseInt(lectureGroupId),
        ...where,
      },
    }
  );

  return NextResponse.json({
    data: StudentLectureGroup,
    status: true,
    count: StudentLectureGroupCount,
  });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedStudentLectureGroup =
    await prisma.studentLectureGroupMapper.delete({
      where: {
        id: parseInt(id),
      },
    });

  return NextResponse.json({ data: deletedStudentLectureGroup, status: true });
}
