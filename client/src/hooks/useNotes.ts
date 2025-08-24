import { useState, useEffect } from "react";
import { Note, NoteFilters } from "@/types/note";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/api/notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from server on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(API_URL);
        const data: Note[] = await res.json();
        setNotes(
          data.map((note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }))
        );
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const createNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      const newNote: Note = await res.json();
      newNote.createdAt = new Date(newNote.createdAt);
      newNote.updatedAt = new Date(newNote.updatedAt);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const updatedNote: Note = await res.json();
      updatedNote.updatedAt = new Date(updatedNote.updatedAt);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateNote(id, { isPinned: !note.isPinned });
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
