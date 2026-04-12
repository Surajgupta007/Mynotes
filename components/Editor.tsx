import { Note } from "@/types/note";
import { useState, useEffect, useRef } from "react";
import { Trash2, SquarePen, MoreHorizontal, Type, Sun, Moon, Save } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { SearchBar } from "./SearchBar";
import { useTheme } from "next-themes";

// ReactQuill must be loaded dynamically
const ReactQuill = dynamic(async () => {
  const { default: RQ, Quill } = await import("react-quill-new");
  const Font = Quill.import("formats/font");
  Font.whitelist = ["inter", "roboto", "lora", "fira-code"];
  Quill.register(Font, true);
  return RQ;
}, { ssr: false });

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onCreateNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'font': ["inter", "roboto", "lora", "fira-code"] }],
    [{ 'header': [1, 2, 3, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }], 
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']                                         
  ],
};

const QUILL_FORMATS = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet'
];

export function Editor({ note, onUpdate, onDelete, onCreateNote, searchQuery, onSearchChange }: EditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [showFormatting, setShowFormatting] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(note.id, { title: newTitle });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdate(note.id, { content: value });
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'html') => {
    let outputContent = content;
    let mimeType = 'text/html';
    let extension = 'html';

    if (format === 'txt') {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      outputContent = tempDiv.textContent || tempDiv.innerText || "";
      mimeType = 'text/plain';
      extension = 'txt';
    }

    const blob = new Blob([outputContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "Note"}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowOptions(false);
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(note.updatedAt));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {!showFormatting && (
        <style dangerouslySetInnerHTML={{__html: `
          .ql-toolbar.ql-snow { display: none !important; }
        `}} />
      )}

      {/* Top Apple Title Bar */}
      <div className="flex-none h-12 flex items-center justify-between px-4 border-b border-[#e5e5e5] dark:border-[#2C2C2E] bg-white dark:bg-[#1E1E1E] z-20 relative">
        <div className="flex items-center gap-2">
          {/* Mock back button */}
          <button className="md:hidden flex items-center text-gray-500 hover:text-black dark:text-[#8E8E93] dark:hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span className="text-[13px] font-medium ml-1">Notes</span>
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-1.5 ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#2C2C2E] text-gray-500 dark:text-[#8E8E93] transition-colors"
              title="Toggle Theme"
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4 relative" ref={optionsRef}>
          <div className="flex items-center gap-2">
            <button 
              onClick={onCreateNote}
              className="text-gray-500 dark:text-[#8E8E93] hover:text-black dark:hover:text-white transition-colors p-1"
              title="New Note"
            >
              <SquarePen size={18} />
            </button>
            <button 
              onClick={() => setShowFormatting(!showFormatting)}
              className={`${showFormatting ? 'text-[#E5B73B]' : 'text-gray-500 dark:text-[#8E8E93]'} hover:text-black dark:hover:text-white transition-colors p-1`}
              title="Formatting Options (Aa)"
            >
              <Type size={18} />
            </button>
            <button 
              onClick={handleSave}
              className="text-gray-500 dark:text-[#8E8E93] hover:text-[#E5B73B] transition-colors p-1 relative"
              title="Save Note"
            >
              <Save size={18} />
              {saveToast && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 min-w-[70px] bg-black/80 text-white text-[11px] font-medium py-1 px-2 rounded-md z-50 animate-fade-in text-center shadow-lg">
                  Saved!
                </span>
              )}
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="text-gray-500 dark:text-[#8E8E93] hover:text-red-500 transition-colors p-1"
              title="Delete Note"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-500 dark:text-[#8E8E93] hover:text-black dark:hover:text-white transition-colors p-1 relative"
              title="Options"
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Options Dropdown Map */}
            {showOptions && (
              <div className="absolute top-10 right-32 w-48 bg-white dark:bg-[#2C2C2E] border border-gray-200 dark:border-[#3A3A3C] shadow-xl rounded-lg py-1 z-50 animate-fade-in">
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-[#3A3A3C]">
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-[#8E8E93] uppercase tracking-wider">Download Note</p>
                </div>
                <button
                  onClick={() => handleDownload('txt')}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3A3A3C] transition-colors"
                >
                  Download as Text (.txt)
                </button>
                <button
                  onClick={() => handleDownload('html')}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3A3A3C] transition-colors"
                >
                  Download as HTML (.html)
                </button>
              </div>
            )}
          </div>
          
          <div className="w-[180px] ml-2 hidden sm:block">
            <SearchBar query={searchQuery} onChange={onSearchChange} />
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1E1E1E]">
        <div className="quill-wrapper flex-1 overflow-y-auto">
          <div className="w-full max-w-[800px] mx-auto pt-6 px-12">
            <div className="text-center text-[11px] font-medium text-gray-400 dark:text-[#8E8E93] mb-6">
              {formattedDate}
            </div>
            
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-[#555555] w-full"
            />
          </div>
          
          <div className="w-full max-w-[800px] mx-auto px-8 pb-32">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleContentChange}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder="Start typing..."
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
