import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
        <Search className="h-3.5 w-3.5 text-gray-400 dark:text-[#8E8E93]" />
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-8 pr-3 py-1.5 text-[13px] bg-gray-100 dark:bg-[#2C2C2E]/80 border border-transparent rounded-[6px] placeholder-gray-400 dark:placeholder-[#8E8E93] text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#1E1E1E] focus:border-indigo-500/30 transition-all"
      />
    </div>
  );
}
