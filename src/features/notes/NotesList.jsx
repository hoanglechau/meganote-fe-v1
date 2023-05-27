import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const NotesList = () => {
  // Custom hook to set the page title
  useTitle("Meganote: Notes List");

  // Get the username, isManager, and isAdmin statuses from the useAuth custom hook
  const { username, isManager, isAdmin } = useAuth();

  // Get data and states from the custom RTK Query hook
  // Rename data to 'notes'
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    // 'notesList' is put here as a query label, which will be shown in Redux Devtools
    // The most recent data on the note list will be requeried (refetched) every 15 seconds
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // content to be conditionally rendered
  let content;

  // Loader when fetching data
  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  // If there's an error, display the error message
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  // If fetching data is successful
  if (isSuccess) {
    // Destructure the ids and entities from the notes data received from the custom RTK Query hook
    const { ids, entities } = notes;

    // Filter the notes to be displayed based on the user's status -> If the user is either an admin or a manager, they'll be able to see all the notes. Otherwise, an employee can only see the notes assigned to them
    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        noteId => entities[noteId].username === username
      );
    }

    // Render the notes in the table using the Note component
    const tableContent =
      ids?.length &&
      filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />);

    // Content to be rendered
    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
