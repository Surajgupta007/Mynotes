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
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#09090b] transition-colors">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-amber-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] overflow-hidden selection:bg-amber-500/30">
      {/* Sidebar - Darker shade in dark mode */}
      <div
        className={`${
          selectedNoteId ? "hidden md:block" : "block"
        } w-full md:w-[260px] lg:w-[300px] h-full flex-none bg-[#f4f4f5] dark:bg-[#040405] border-r border-[#e5e5e5] dark:border-white/5`}
      >
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateNote={handleCreateNote}
        />
      </div>

      {/* Editor Area */}
      <div
        className={`${
          !selectedNoteId ? "hidden md:flex" : "flex"
        } flex-1 flex-col h-full overflow-hidden bg-white dark:bg-[#09090b]`}
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
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 relative">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50 dark:opacity-20 pointer-events-none"></div>
             <div className="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-white/5 shadow-xl border border-gray-100 dark:border-white/10 flex items-center justify-center animate-slide-up-fade backdrop-blur-md">
                 <Sparkles size={32} className="text-amber-500 drop-shadow-sm" />
             </div>
             <p className="text-base font-semibold text-gray-900 dark:text-gray-200 mb-2 animate-slide-up-fade" style={{animationDelay: '100ms'}}>Your mental canvas awaits</p>
             <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-6 max-w-[250px] text-center animate-slide-up-fade" style={{animationDelay: '150ms'}}>Capture your ideas, organize your thoughts, or just start writing.</p>
             <button
               onClick={handleCreateNote}
               className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white dark:text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 animate-slide-up-fade"
               style={{animationDelay: '200ms'}}
             >
               Create New Note
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
