import { motion } from 'framer-motion';
import { Pin, Edit3, Trash2, Calendar } from 'lucide-react';
import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface NoteCardProps {
  note: Note;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryLabels = {
  work: 'Work',
  personal: 'Personal',
  ideas: 'Ideas',
  tasks: 'Tasks'
};

export function NoteCard({ note, onPin, onDelete }: NoteCardProps) {
  const truncatedContent = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="note-card group relative p-6 rounded-xl border bg-card"
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-4 right-4 p-1 rounded-full bg-accent/20">
          <Pin className="w-3 h-3 text-accent" />
        </div>
      )}

      {/* Category pill */}
      <div className={`category-pill category-${note.category} inline-block mb-3`}>
        {categoryLabels[note.category]}
      </div>

      {/* Note title */}
      <Link to={`/note/${note.id}`}>
        <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
          {note.title || 'Untitled Note'}
        </h3>
      </Link>

      {/* Note content preview */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {truncatedContent}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-secondary/50 text-secondary-foreground rounded-md">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPin(note.id)}
            className="h-8 w-8 p-0 hover:bg-accent/20"
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'text-accent' : 'text-muted-foreground'}`} />
          </Button>
          
          <Link to={`/note/${note.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20">
              <Edit3 className="w-4 h-4 text-primary" />
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}