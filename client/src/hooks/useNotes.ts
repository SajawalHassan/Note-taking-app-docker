import { useState, useEffect } from "react";
import { Note, NoteFilters } from "@/types/note";

const NOTES_STORAGE_KEY = "flownote-notes";

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to FlowNote",
    content:
      "This is your first note! FlowNote helps you capture and organize your thoughts with beautiful animations and smooth interactions. Try creating a new note by clicking the + button.",
    category: "personal",
    tags: ["welcome", "getting-started"],
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    isPinned: true,
  },
  {
    id: "2",
    title: "Project Ideas",
    content:
      "Brainstorming session for new features:\n\n- Real-time collaboration\n- Voice notes\n- AI-powered categorization\n- Cross-device sync\n- Rich text formatting",
    category: "ideas",
    tags: ["brainstorm", "features"],
    createdAt: new Date("2024-01-14T15:45:00"),
    updatedAt: new Date("2024-01-14T16:20:00"),
    isPinned: false,
  },
  {
    id: "3",
    title: "Meeting Notes - Q1 Planning",
    content:
      "Key decisions from today's planning meeting:\n\n1. Focus on user experience improvements\n2. Implement dark mode by March\n3. Add mobile responsiveness\n4. User testing scheduled for February",
    category: "work",
    tags: ["meeting", "planning", "q1"],
    createdAt: new Date("2024-01-13T09:15:00"),
    updatedAt: new Date("2024-01-13T11:30:00"),
    isPinned: false,
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY);
      if (stored) {
        const parsedNotes = JSON.parse(stored).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } else {
        // Initialize with sample notes
        setNotes(sampleNotes);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sampleNotes));
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      setNotes(sampleNotes);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!loading && notes.length > 0) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loading]);

  const createNote = (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...noteData,
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const togglePin = (id: string) => {
    updateNote(id, { isPinned: !notes.find((n) => n.id === id)?.isPinned });
  };

  const filterNotes = (filters: NoteFilters) => {
    return notes.filter((note) => {
      if (filters.category && note.category !== filters.category) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        return filters.tags.some((tag) =>
          note.tags.some((noteTag) =>
            noteTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
      }
      return true;
    });
  };

  const getNote = (id: string) => notes.find((note) => note.id === id);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    filterNotes,
    getNote,
  };
}
