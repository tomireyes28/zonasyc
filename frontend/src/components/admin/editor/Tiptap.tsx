"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Tiptap({ content, onChange }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-zonasyc-red underline hover:text-red-400 transition-colors cursor-pointer',
        },
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl shadow-lg border border-slate-700/50 my-6',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-slate max-w-none focus:outline-none min-h-[400px] p-4 text-slate-300',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Función para agregar o quitar links
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    // Cancelado
    if (url === null) return;
    // Vacío = quitar link
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    // Setear nuevo link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Función para incrustar YouTube
  const addYoutubeVideo = () => {
    const url = window.prompt('Pegá la URL del video de YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

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

        <div className="w-px h-6 bg-slate-700 mx-1 self-center"></div>

        {/* NUEVOS BOTONES */}
        <button
          onClick={setLink}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('link') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
        >
          🔗 Link
        </button>
        <button
          onClick={addYoutubeVideo}
          className="px-3 py-1.5 rounded text-sm font-medium transition-colors text-slate-400 hover:bg-slate-700 hover:text-slate-200"
        >
          📺 YouTube
        </button>
      </div>

      {/* ÁREA DE ESCRITURA */}
      <EditorContent editor={editor} />
    </div>
  );
}