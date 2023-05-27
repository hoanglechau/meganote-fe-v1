// Use FontAwesome to create icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      // the 'entities' property is from the 'usersAdapter' in usersApiSlice, which contains all the users
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  // If the user exists
  if (user) {
    // Navigate to the edit user page when the edit button is clicked
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    // Improve formatting to make it easier to read
    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    // If the user is inactive, add the 'table__cell--inactive' class to the cell
    const cellStatus = user.active ? "" : "table__cell--inactive";

    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null; // if there's no user
};

// React optimization
// Memoize the component -> Only re-render when the props change -> This component will only re-render when the data is changed
const memoizedUser = memo(User);

export default memoizedUser;
