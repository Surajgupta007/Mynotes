import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(note.updatedAt));

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent ${
        isSelected
          ? "bg-white dark:bg-[#2A2A2A] shadow-sm border-gray-200 dark:border-gray-700"
          : "hover:bg-gray-200/50 dark:hover:bg-[#2A2A2A]/50"
      }`}
    >
      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
        {note.content || "Empty note"}
      </p>
      <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-medium">
        {formattedDate}
      </p>
    </button>
  );
}
