import { Note } from "@/types/note";
import { NoteCard } from "./NoteCard";

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
