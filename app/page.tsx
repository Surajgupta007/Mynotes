"use client";

import { useNotes } from "@/hooks/useNotes";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { notes, createNote, updateNote, deleteNote, isLoaded } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeNote = notes.find((note) => note.id === selectedNoteId) || null;

  const handleCreateNote = () => {
    const newId = createNote();
    setSelectedNoteId(newId);
    setSearchQuery(""); // clear search on create
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1E1E1E] transition-colors">
        <div className="animate-pulse flex items-center gap-3 text-gray-500">
          Loading...
        </div>
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
             <p className="text-sm font-medium">No Note Selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
