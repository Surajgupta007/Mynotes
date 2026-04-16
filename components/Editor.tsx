import { Note } from "@/types/note";
import { useState, useEffect, useRef } from "react";
import { Trash2, SquarePen, MoreHorizontal, Type, Sun, Moon, Save, PanelLeft } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { SearchBar } from "./SearchBar";
import { useTheme } from "next-themes";

// ReactQuill must be loaded dynamically
const ReactQuill = dynamic(async () => {
  const { default: RQ, Quill } = await import("react-quill-new");
  
  // Provide Quill globally for the image resize module
  (window as any).Quill = Quill;

  // Import and register the image resize module
  const { default: ImageResize } = await import("quill-image-resize-module-react");
  Quill.register("modules/imageResize", ImageResize);

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
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'font': ["inter", "roboto", "lora", "fira-code"] }],
    [{ 'header': [1, 2, 3, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }], 
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['image', 'clean']                                         
  ],
  imageResize: {
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  }
};

const QUILL_FORMATS = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'image',
  'align', 'width', 'style'
];

export function Editor({ note, onUpdate, onDelete, onCreateNote, searchQuery, onSearchChange, isSidebarOpen, onToggleSidebar }: EditorProps) {
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

  const handleDownloadPDF = async () => {
    try {
      // Dynamic import to prevent SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
        <div style="font-family: sans-serif; padding: 20px; color: #000;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">${title}</h1>
          ${content}
        </div>
      `;
      
      html2pdf().from(tempDiv).set({
        margin: 1,
        filename: `${title || 'Note'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).save();
      
      setShowOptions(false);
    } catch (e) {
      console.error("Failed to generate PDF", e);
    }
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
      <div className="flex-none h-12 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md z-20 relative shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <PanelLeft size={18} className={!isSidebarOpen ? "text-gray-400" : ""} />
          </button>
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
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 min-w-[80px] bg-white dark:bg-[#1a1a1c] text-gray-900 dark:text-white text-[12px] font-semibold py-1.5 px-3 rounded-full z-50 animate-slide-up-fade text-center shadow-xl ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Saved
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
              <div className="absolute top-10 right-32 w-56 bg-white/95 dark:bg-[#1a1a1c]/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 shadow-2xl rounded-xl py-1.5 z-50 animate-slide-up-fade">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Export Document</p>
                </div>
                <button
                  onClick={handleDownloadPDF}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-amber-600 dark:hover:text-amber-500 transition-colors flex items-center gap-2"
                >
                  <span className="opacity-70 text-xs">PDF</span> Download as PDF
                </button>
                <div className="border-t border-gray-50 dark:border-white/5 my-1 mx-2"></div>
                <button
                  onClick={() => handleDownload('txt')}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <span className="opacity-70 text-xs">TXT</span> Download as Text
                </button>
                <button
                  onClick={() => handleDownload('html')}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <span className="opacity-70 text-xs">HTM</span> Download as HTML
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
