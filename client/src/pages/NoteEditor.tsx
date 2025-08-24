import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Pin, Trash2, Hash } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotes } from "@/hooks/useNotes";
import { Note, NoteCategory } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

const categoryOptions: { value: NoteCategory; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "ideas", label: "Ideas" },
  { value: "tasks", label: "Tasks" },
];

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const { toast } = useToast();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("personal");
  const [tagsInput, setTagsInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currentNote = isNew ? null : notes.find((note) => note.id === id);

  // Load existing note data
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCategory(currentNote.category);
      setTagsInput(currentNote.tags.join(", "));
      setIsPinned(currentNote.isPinned);
    }
  }, [currentNote, isNew, navigate]);

  // Track changes
  useEffect(() => {
    if (isNew) {
      setHasChanges(title.trim() !== "" || content.trim() !== "");
    } else if (currentNote) {
      const tagsChanged =
        tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .join(", ") !== currentNote.tags.join(", ");
      setHasChanges(
        title !== currentNote.title ||
          content !== currentNote.content ||
          category !== currentNote.category ||
          tagsChanged ||
          isPinned !== currentNote.isPinned
      );
    }
  }, [title, content, category, tagsInput, isPinned, currentNote, isNew]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Cannot save empty note",
        description: "Please add a title or content before saving.",
        variant: "destructive",
      });
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const noteData = {
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      category,
      tags,
      isPinned,
    };

    if (isNew) {
      const newNote = await createNote(noteData);
      toast({
        title: "Note created",
        description: "Your new note has been saved successfully.",
      });
      navigate(`/note/${newNote.id}`, { replace: true });
    } else {
      updateNote(id!, noteData);
      toast({
        title: "Note updated",
        description: "Your changes have been saved successfully.",
      });
      setHasChanges(false);
    }
  };

  const handleDelete = () => {
    if (currentNote) {
      deleteNote(currentNote.id);
      toast({
        title: "Note deleted",
        description: "Your note has been permanently deleted.",
      });
      navigate("/");
    }
  };

  const handlePin = () => {
    if (isNew) {
      setIsPinned(!isPinned);
    } else {
      togglePin(id!);
      setIsPinned(!isPinned);
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-card-hover"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notes
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-xl font-semibold">
            {isNew ? "New Note" : "Edit Note"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePin}
            className={isPinned ? "bg-accent/10 border-accent text-accent" : ""}
          >
            <Pin className="w-4 h-4 mr-2" />
            {isPinned ? "Pinned" : "Pin"}
          </Button>

          {!isNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10 hover:border-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Note
          </Button>
        </div>
      </motion.div>

      {/* Editor Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Title Input */}
        <div>
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 pb-4 border-b border-border/50">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value: NoteCategory) => setCategory(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Tags (comma separated)
            </label>
            <Input
              placeholder="work, important, project..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="bg-card"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <Textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-none bg-transparent px-0 py-4 text-base leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        </div>
      </motion.div>

      {/* Auto-save indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning"
        >
          Unsaved changes
        </motion.div>
      )}
    </AppLayout>
  );
}
