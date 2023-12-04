import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "../helpers/authentication";

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

  const boards = await prisma.board.findMany({
    where,
  });

  const boardCount = await prisma.board.count({
    where,
  });

  return NextResponse.json({ data: boards, status: true, count: boardCount });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  if (!body.boardName && !body.boardShortForm) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const newBoard = await prisma.board.create({
    data: {
      name: body.boardName,
      key: body.boardShortForm,
      status: body.boardStatus,
    },
  });

  return NextResponse.json({ data: newBoard, status: true });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  if (
    !body.boardName &&
    !body.boardShortForm &&
    !body.boardStatus &&
    !body.boardId
  ) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const updatedBoard = await prisma.board.update({
    data: {
      name: body.boardName,
      key: body.boardShortForm,
      status: body.boardStatus,
    },
    where: {
      id: parseInt(body.boardId),
    },
  });

  return NextResponse.json({ data: updatedBoard, status: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "You are not Admin", status: false });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Send All Details", status: false });
  }

  const deletedBoard = await prisma.board.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({ data: deletedBoard, status: true });
}
