import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

const Note = ({ noteId }) => {
  // Get 'note' from the data that is already queried -> This will not make a new request
  const { note } = useGetNotesQuery("notesList", {
    // We already know that we have the result, and we're getting the data from it
    selectFromResult: ({ data }) => ({
      // We want a specific note with noteId
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  // If note exists
  if (note) {
    // Date note created
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    // Date note updated
    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    // Navigate to the edit note page when the edit button is clicked
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null; // If there's no note
};

// React optimization
// Memoize the component -> Only re-render when the props change -> This component will only re-render when the data is changed
const memoizedNote = memo(Note);

export default memoizedNote;
