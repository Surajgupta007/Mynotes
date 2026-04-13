import { useState, useEffect, useCallback } from "react";
import { Note } from "@/types/note";
import { useSession } from "next-auth/react";

export function useNotes() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!session?.user) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Note",
          content: "",
        }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        return newNote.id;
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
    return null;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    // Optimistic UI update
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );

    try {
      await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      fetchNotes(); // Revert on failure
    }
  };

  const deleteNote = async (id: string) => {
    // Optimistic UI update
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete note:", error);
      fetchNotes(); // Revert on failure
    }
  };

  return { notes, addNote, updateNote, deleteNote, isLoading };
}
