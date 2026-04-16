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
      title={note.title || "New Note"}
      className={`group w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer relative overflow-hidden ${
        isSelected
          ? "bg-gradient-to-r from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/5 text-gray-900 dark:text-white shadow-sm ring-1 ring-amber-500/20 dark:ring-amber-500/30 font-semibold"
          : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:scale-[1.02]"
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-lg animate-fade-in" />
      )}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isSelected ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors'}`}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <span className="text-[13px] font-medium truncate flex-1">
        {note.title || "New Note"}
      </span>
    </button>
  );
}
