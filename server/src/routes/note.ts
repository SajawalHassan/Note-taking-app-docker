import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ✅ Create a note
router.post("/", async (req, res) => {
  try {
    const { title, content, category, tags, isPinned, color } = req.body;
    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        tags,
        isPinned,
        color,
      },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note", details: error });
  }
});

// ✅ Get all notes
router.get("/", async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Get a single note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// ✅ Update a note
router.put("/:id", async (req, res) => {
  try {
    const { title, content, category, tags, isPinned, color } = req.body;
    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { title, content, category, tags, isPinned, color },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ✅ Delete a note
router.delete("/:id", async (req, res) => {
  try {
    await prisma.note.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
