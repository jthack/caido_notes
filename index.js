// Notes Extension

// Get Notes from Local Storage
var getNotes = () => {
  return JSON.parse(localStorage.getItem("caido_notes") || "[]");
};

// Save Notes to Local Storage
var saveNotes = (notes) => {
  localStorage.setItem("caido_notes", JSON.stringify(notes));
};

// Create Note
var createNote = (text) => {
  const notes = getNotes();
  const newNote = {
    id: Date.now().toString(),
    text: text,
  };
  notes.push(newNote);
  saveNotes(notes);
};

// Delete Note
var deleteNote = (id) => {
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  saveNotes(updatedNotes);
};

// Notes UI
var createNotesUI = () => {
  const notesContainer = document.createElement("div");
  notesContainer.className = "notes-container";

  const notesHeader = document.createElement("div");
  notesHeader.className = "notes-header";
  notesHeader.textContent = "Notes";

  const notesInput = document.createElement("input");
  notesInput.className = "notes-input";
  notesInput.placeholder = "Enter a new note...";

  const addNoteButton = Caido.ui.button({
    label: "Add Note",
    variant: "primary",
    size: "small",
  });
  addNoteButton.addEventListener("click", () => {
    const noteText = notesInput.value.trim();
    if (noteText !== "") {
      createNote(noteText);
      notesInput.value = "";
      renderNotes();
    }
  });

  const notesList = document.createElement("ul");
  notesList.className = "notes-list";

  const renderNotes = () => {
    const notes = getNotes();
    notesList.innerHTML = "";

    notes.forEach((note) => {
      const noteItem = document.createElement("li");
      noteItem.className = "note-item";

      const noteText = document.createElement("span");
      noteText.className = "note-text";
      noteText.textContent = note.text;

      const deleteButton = Caido.ui.button({
        leadingIcon: "fas fa-trash",
        variant: "tertiary",
        size: "small",
      });
      deleteButton.addEventListener("click", () => {
        deleteNote(note.id);
        renderNotes();
      });

      noteItem.appendChild(noteText);
      noteItem.appendChild(deleteButton);
      notesList.appendChild(noteItem);
    });
  };

  notesContainer.appendChild(notesHeader);
  notesContainer.appendChild(notesInput);
  notesContainer.appendChild(addNoteButton);
  notesContainer.appendChild(notesList);

  renderNotes();

  return notesContainer;
};

// Register Notes Extension
var notesExtension = () => {
  Caido.navigation.addPage("/notes", {
    body: createNotesUI(),
  });

  Caido.sidebar.registerItem("Notes", "/notes", {
    icon: "fas fa-sticky-note",
    group: "Notes Extension",
  });
};

notesExtension();
