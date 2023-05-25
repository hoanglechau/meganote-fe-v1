import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
  // Get the username and status from the useAuth custom hook
  const { username, isManager, isAdmin } = useAuth();

  // Custom hook to set the page title
  useTitle(`Meganote: ${username}`);

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  // Content to be rendered
  // Only show the "View User Settings" and "Add New User" links if the user is a manager or admin
  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome {username}!</h1>

      <p>
        <Link to="/dash/notes">View Notes</Link>
      </p>

      <p>
        <Link to="/dash/notes/new">Add New Note</Link>
      </p>

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );

  return content;
};

export default Welcome;
