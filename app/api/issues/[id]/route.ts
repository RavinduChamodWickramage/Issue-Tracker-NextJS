import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { updateIssueSchema } from "../../../schemas/updateIssueSchema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const issue = await prisma.issues.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the issue." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateIssueSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, description, status } = validation.data;

    const issue = await prisma.issues.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const updatedIssue = await prisma.issues.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the issue." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const issue = await prisma.issues.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    await prisma.issues.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting the issue." },
      { status: 500 }
    );
  }
}
