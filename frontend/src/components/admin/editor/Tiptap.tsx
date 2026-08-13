"use client";

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import { uploadImageAction } from '@/app/admin/actions';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Tiptap({ content, onChange }: TiptapProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full border border-slate-700/50 my-6 shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-zonasyc-red underline hover:text-red-400 transition-colors cursor-pointer',
        },
      }),
      Youtube.configure({
        inline: false,
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl shadow-lg border border-slate-700/50 my-8 block',
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

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Pegá la URL del video de YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  // Función para subir e insertar la imagen en el texto
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData);

    if (result.error) {
      alert(`Error al subir: ${result.error}`);
    } else if (result.url) {
      // Si la subida fue exitosa, la insertamos en el editor
      editor.chain().focus().setImage({ src: result.url }).run();
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-900/50">
      
      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-slate-800/50 border-b border-slate-700/50 p-2 flex flex-wrap gap-2 items-center">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bold') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('italic') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>Italic</button>
        
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>H3</button>

        <div className="w-px h-6 bg-slate-700 mx-1"></div>

        <button onClick={setLink} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('link') ? 'bg-zonasyc-red text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>🔗 Link</button>
        <button onClick={addYoutubeVideo} className="px-3 py-1.5 rounded text-sm font-medium transition-colors text-slate-400 hover:bg-slate-700 hover:text-slate-200">📺 YouTube</button>
        
        {/* BOTÓN DE IMAGEN PARA EL EDITOR */}
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isUploading ? 'text-slate-500 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-slate-500 border-t-zonasyc-red rounded-full animate-spin"></div>
            ) : "📸"}
            Imagen
          </button>
        </div>
      </div>

      {/* ÁREA DE ESCRITURA */}
      <EditorContent editor={editor} />
    </div>
  );
}