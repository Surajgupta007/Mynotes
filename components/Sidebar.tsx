import { Note } from "@/types/note";
import { NoteCard } from "./NoteCard";
import { NotebookPen, Plus } from "lucide-react";

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateNote: () => void;
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  searchQuery,
  onCreateNote,
}: SidebarProps) {
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col hide-scrollbar py-2 pt-6 bg-transparent">
      <div className="px-6 mb-6 flex items-center gap-2.5 group cursor-pointer">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-105">
          <NotebookPen size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-[16px] bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent tracking-tight">
          Smart Notes
        </span>
      </div>

      <div className="px-4 flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 px-2 uppercase tracking-wider">
          Notes
        </h2>
        <button 
          onClick={onCreateNote}
          className="p-1 mr-2 rounded-md hover:bg-gray-200/60 dark:hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
          title="Create New Note"
        >
          <Plus size={16} className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-[2px]">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 dark:text-[#8E8E93]">No notes found.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onClick={() => onSelectNote(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
