import { createContext, useState, useEffect } from "react";

export const NoteContext = createContext();

export function NoteProvider(props) {
  const HOST = "http://localhost:8080";

  const initialNotes = [];

  const [notes, setNotes] = useState(initialNotes);

  const getNotes = async () => {
    try {
      const response = await fetch(`${HOST}/api/notes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async (newNote) => {
    try {
      const response = await fetch(`${HOST}/api/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const addedNote = await response.json();
      setNotes([...notes, addedNote]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${HOST}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      await response.json();
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = async (noteId, updatedNote) => {
    try {
      const response = await fetch(`${HOST}/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const editedNote = await response.json();
      setNotes(
        notes.map((note) =>
          note._id === noteId ? { ...note, ...editedNote } : note
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, updateNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
}
