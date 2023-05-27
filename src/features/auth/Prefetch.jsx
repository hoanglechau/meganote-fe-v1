// This component initiates the states for Redux, making sure that these queries have all the data ahead of time. Even when the page is refreshed, we'll get all the data again quickly
import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  // Only run this when the component mounts
  useEffect(() => {
    // 'prefetch' is built in -> prefetch the data for the hooks that we're using
    // 'force: true' -> force the data to be fetched again
    // 'getNotes' and 'getUsers' are the names of the endpoints
    // 'notesList' and 'usersList' are arguments that are passed in to name these
    // Subscription: the components use the data from Redux (subscribed while the components are mounted). When the components unmount, they hold the data for 60 seconds by default
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
