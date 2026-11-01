const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- Simple JSON-file store ----
function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// ---- REST API ----

// GET /notes - list all notes (newest first)
app.get("/notes", (req, res) => {
  const notes = readNotes().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(notes);
});

// POST /notes - create a note
app.post("/notes", (req, res) => {
  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  if (title.length > 100 || content.length > 2000) {
    return res.status(400).json({ error: "Note is too long." });
  }

  const note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  const notes = readNotes();
  notes.push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// DELETE /notes/:id - delete a note
app.delete("/notes/:id", (req, res) => {
  const notes = readNotes();
  const remaining = notes.filter((n) => n.id !== req.params.id);

  if (remaining.length === notes.length) {
    return res.status(404).json({ error: "Note not found." });
  }

  writeNotes(remaining);
  res.json({ message: "Note deleted." });
});

app.listen(PORT, () => {
  console.log(`Quick Note app running on port ${PORT}`);
});
