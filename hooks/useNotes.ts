"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("smart_notes_data");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.error("Failed to parse notes from storage", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("smart_notes_data", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date().toISOString(), // Update timestamp
            }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    isLoaded,
  };
}
