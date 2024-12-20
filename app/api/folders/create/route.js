import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth || !req.auth.user || !req.auth.user.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const userId = req.auth.user.id;

    if (!body.name) {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    const folderExist = await prisma.folder.findFirst({
      where: {
        name: body.name,
        userId: userId,
      },
    });

    if (folderExist) {
      return NextResponse.json(
        { message: "Folder name already exists" },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name: body.name,
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(
      { message: "Folder added successfully", folder },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error creating folder:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
});
