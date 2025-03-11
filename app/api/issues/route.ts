import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const newIssue = await prisma.issues.create({
      data: { title: body.title, description: body.description },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the issue." },
      { status: 500 }
    );
  }
}
