"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Tiptap({ content, onChange }: TiptapProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        // Acá definimos el estilo del área donde se escribe (Tipografía clara, interlineado, sin bordes feos al hacer focus)
        class: 'prose prose-invert prose-slate max-w-none focus:outline-none min-h-[400px] p-4 text-slate-300',
      },
    },
    onUpdate: ({ editor }) => {
      // Cada vez que el usuario teclea, devolvemos el HTML limpio al componente padre
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-900/50">
      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bold') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('italic') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
        >
          Italic
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
        >
          H3
        </button>
      </div>

      {/* ÁREA DE ESCRITURA */}
      <EditorContent editor={editor} />
    </div>
  );
}