import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '@/types/note';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotesGrid({ notes, onPin, onDelete }: NotesGridProps) {
  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);
  const sortedNotes = [...pinnedNotes, ...unpinnedNotes];

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No notes yet
        </h3>
        <p className="text-muted-foreground">
          Create your first note to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPin={onPin}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}