import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchAndFilter } from "@/components/notes/SearchAndFilter";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { NoteFilters } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { notes, loading, deleteNote, togglePin, filterNotes } = useNotes();
  const [filters, setFilters] = useState<NoteFilters>({});
  const { toast } = useToast();

  const filteredNotes = useMemo(() => {
    return filterNotes(filters);
  }, [notes, filters, filterNotes]);

  const handleDelete = (id: string) => {
    deleteNote(id);
    toast({
      title: "Note deleted",
      description: "Your note has been successfully deleted.",
    });
  };

  const handlePin = (id: string) => {
    togglePin(id);
    const note = notes.find((n) => n.id === id);
    toast({
      title: note?.isPinned ? "Note unpinned" : "Note pinned",
      description: note?.isPinned
        ? "Note removed from pinned notes."
        : "Note pinned to the top.",
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                FlowNote
              </h1>
              <p className="text-muted-foreground">Take notes or smth</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          noteCount={filteredNotes.length}
        />
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <NotesGrid
          notes={filteredNotes}
          onPin={handlePin}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Floating Action Button */}
      <Link to="/note/new">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fab"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </Link>
    </AppLayout>
  );
}
