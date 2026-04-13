import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const updates = await req.json();

    await dbConnect();

    // Ensure users can only update their own notes
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ message: "Note not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedNote._id.toString(),
      title: updatedNote.title,
      content: updatedNote.content,
      updatedAt: updatedNote.updatedAt.toISOString()
    });
  } catch (error) {
    console.error("Update note error:", error);
    return NextResponse.json({ message: "Error updating note" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deletedNote) {
      return NextResponse.json({ message: "Note not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json({ message: "Error deleting note" }, { status: 500 });
  }
}
