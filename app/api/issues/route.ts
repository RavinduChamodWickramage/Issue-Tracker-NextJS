import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createIssueSchema } from "../../schemas/createIssueSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(
        { errors: validation.error.format() },
        { status: 400 }
      );

    const newIssue = await prisma.issues.create({
      data: { title: body.title, description: body.description },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the issue." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const issues = await prisma.issues.findMany();
  return NextResponse.json(issues);
}
