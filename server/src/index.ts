import express, { Request, Response } from "express";
import notesRouter from "./routes/note";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/notes", notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
