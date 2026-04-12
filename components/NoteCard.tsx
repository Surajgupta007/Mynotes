import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 cursor-default ${
        isSelected
          ? "bg-gray-200 dark:bg-[#E5B73B] text-gray-900 dark:text-black"
          : "hover:bg-gray-100 dark:hover:bg-[#2C2C2E]/50 text-gray-600 dark:text-white"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isSelected ? 'opacity-70' : 'text-gray-400 dark:text-[#8E8E93]'}`}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <span className={`text-[13px] font-medium truncate flex-1 ${isSelected ? 'font-semibold' : ''}`}>
        {note.title || "New Note"}
      </span>
    </button>
  );
}
