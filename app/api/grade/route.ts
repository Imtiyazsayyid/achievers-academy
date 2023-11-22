import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

  if (status && status != "all") {
    where = {
      ...where,
      status: status === "active" ? true : false,
    };
  }

  const grades = await prisma.grade.findMany({
    where,
  });

  return NextResponse.json({ data: grades, status: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.gradeName && !body.gradeShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newGrade = await prisma.grade.create({
    data: {
      name: body.gradeName,
      status: body.gradeStatus,
    },
  });

  return NextResponse.json({ data: newGrade, status: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (
    !body.gradeName &&
    !body.gradeShortForm &&
    !body.gradeStatus &&
    !body.gradeId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedGrade = await prisma.grade.update({
    data: {
      name: body.gradeName,
      status: body.gradeStatus,
    },
    where: {
      id: parseInt(body.gradeId),
    },
  });

  return NextResponse.json({ data: updatedGrade, status: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedGrade = await prisma.grade.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedGrade, status: true });
}
