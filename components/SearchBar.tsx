import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-3 py-2 text-sm bg-gray-200/50 dark:bg-[#2A2A2A] border-none rounded-md placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-shadow"
      />
    </div>
  );
}
