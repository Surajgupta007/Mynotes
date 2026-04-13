import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Sort by most recently updated
    const notes = await Note.find({ userId: session.user.id }).sort({ updatedAt: -1 });
    
    // Map _id to id for the frontend
    const mappedNotes = notes.map(note => ({
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt.toISOString()
    }));

    return NextResponse.json(mappedNotes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    return NextResponse.json({ message: "Error fetching notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    await dbConnect();

    const newNote = await Note.create({
      userId: session.user.id,
      title: title || "New Note",
      content: content || "",
    });

    return NextResponse.json({
      id: newNote._id.toString(),
      title: newNote.title,
      content: newNote.content,
      updatedAt: newNote.updatedAt.toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ message: "Error creating note" }, { status: 500 });
  }
}
