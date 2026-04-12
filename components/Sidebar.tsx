import { Note } from "@/types/note";
import { Search, Plus } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { SearchBar } from "./SearchBar";

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#191919] flex flex-col transition-colors duration-200">
      <div className="p-4 flex-col flex gap-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Notes
          </h2>
          <button
            onClick={onCreateNote}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="Create new note"
          >
            <Plus size={18} />
          </button>
        </div>
        <SearchBar query={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 px-4 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? "No notes matching your search." : "No notes yet. Click the + button to create one!"}
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
