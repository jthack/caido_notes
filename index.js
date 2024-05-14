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

  const notesInput = document.createElement("textarea");
  notesInput.className = "notes-input";
  notesInput.placeholder = "Enter a new note...";

  const addNoteButton = Caido.ui.button({
    label: "Add Note",
    variant: "primary",
    size: "medium",
  });
  addNoteButton.addEventListener("click", () => {
    const noteText = notesInput.value.trim();
    if (noteText !== "") {
      createNote(noteText);
      notesInput.value = "";
      renderNotes();
    }
  });

  const notesTable = document.createElement("table");
  notesTable.className = "notes-table";

  const renderNotes = () => {
    const notes = getNotes();
    notesTable.innerHTML = `
      <thead>
        <tr>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${notes
          .map(
            (note) => `
          <tr>
            <td>${note.text}</td>
            <td>
              <button class="delete-button" data-id="${note.id}">Delete</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;

    const deleteButtons = notesTable.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const noteId = button.getAttribute("data-id");
        deleteNote(noteId);
        renderNotes();
      });
    });
  };

  notesContainer.appendChild(notesHeader);
  notesContainer.appendChild(notesInput);
  notesContainer.appendChild(addNoteButton);
  notesContainer.appendChild(notesTable);

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
