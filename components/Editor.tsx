import { Note } from "@/types/note";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Edit3, Trash2 } from "lucide-react";

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export function Editor({ note, onUpdate, onDelete }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  
  // Local state for immediate typing feel, synced with parent on change
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(note.id, { title: newTitle });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(note.id, { content: newContent });
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(note.updatedAt));

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#121212] h-full overflow-hidden transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Last edited {formattedDate}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isPreview ? (
              <>
                <Edit3 size={16} /> Edit
              </>
            ) : (
              <>
                <Eye size={16} /> Preview
              </>
            )}
          </button>
          
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete Note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-8">
        {!isPreview ? (
          <div className="flex flex-col h-full gap-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="text-4xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 w-full"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing your note here... (Markdown supported)"
              className="flex-1 w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 resize-none text-lg leading-relaxed placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>
        ) : (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {title && <h1>{title}</h1>}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || "*Empty note*"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
