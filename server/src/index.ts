import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express from Docker-compose!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
