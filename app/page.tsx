"use client";

import { useNotes } from "@/hooks/useNotes";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const { notes, addNote, updateNote, deleteNote, isLoading } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeNote = notes.find((note) => note.id === selectedNoteId) || null;

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  const handleCreateNote = async () => {
    const newId = await addNote();
    if (newId) {
      setSelectedNoteId(newId);
      setSearchQuery("");
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  if (status === "loading" || status === "unauthenticated" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] dark:bg-[#0A0A0B] transition-colors">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#E5B73B] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#1E1E1E] overflow-hidden">
      {/* Sidebar - Darker shade in dark mode */}
      <div
        className={`${
          selectedNoteId ? "hidden md:block" : "block"
        } w-full md:w-[260px] lg:w-[300px] h-full flex-none bg-[#f9f9f9] dark:bg-[#1C1C1E] border-r border-[#e5e5e5] dark:border-[#2C2C2E]`}
      >
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Editor Area */}
      <div
        className={`${
          !selectedNoteId ? "hidden md:flex" : "flex"
        } flex-1 flex-col h-full overflow-hidden bg-white dark:bg-[#1E1E1E]`}
      >
        {activeNote ? (
           <Editor
             note={activeNote}
             onUpdate={updateNote}
             onDelete={handleDeleteNote}
             onCreateNote={handleCreateNote}
             searchQuery={searchQuery}
             onSearchChange={setSearchQuery}
           />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
             <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-[#2C2C2E] flex items-center justify-center">
                 <Sparkles size={24} className="opacity-40" />
             </div>
             <p className="text-sm font-medium">Select or create a note to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
