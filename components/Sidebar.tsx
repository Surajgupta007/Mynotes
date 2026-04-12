import { Note } from "@/types/note";
import { NoteCard } from "./NoteCard";
import { NotebookPen } from "lucide-react";

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  searchQuery,
}: SidebarProps) {
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col hide-scrollbar py-2 pt-6">
      <div className="px-6 mb-6 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded bg-[#E5B73B] flex items-center justify-center shadow-sm">
          <NotebookPen size={14} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[15px] text-gray-900 dark:text-white tracking-tight">
          Smart Notes
        </span>
      </div>

      <div className="px-4">
        <h2 className="text-[11px] font-semibold text-gray-500 dark:text-[#8E8E93] mb-2 px-2 uppercase tracking-wider">
          Notes
        </h2>
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
