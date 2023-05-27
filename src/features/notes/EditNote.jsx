import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditNote = () => {
  // Custom hook to set the title of the page
  useTitle("Meganote: Edit Note");

  // Get the id from the URL
  const { id } = useParams();

  // Get the username and the isManager, isAdmin statuses from the custom useAuth hook
  const { username, isManager, isAdmin } = useAuth();

  // Get the note -> results in a single note
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });

  // Get the list of users -> results in an array of users
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id]),
    }),
  });

  // If there is no note or no users, show a loading spinner
  if (!note || !users?.length) return <PulseLoader color={"#FFF"} />;

  // If the user is not a manager or admin, and the note's username does not match the user's username, show an error message
  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  // Content to be rendered
  const content = <EditNoteForm note={note} users={users} />;

  return content;
};

export default EditNote;
