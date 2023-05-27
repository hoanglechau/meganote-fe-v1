import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const UsersList = () => {
  useTitle("Meganote: Users List");

  // Get data and states from the custom hook useGetUsersQuery from usersApiSlice
  const {
    // rename the data to 'users'
    // these look like the data from a custom axios hook
    // apart from data, we also get several states 'isLoading', 'isSuccess', 'isError', 'error' from the custom hook, which will allow us to conditionally render contents
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    // 'usersList' is put here as a query label, which will be shown in Redux Devtools
    // 60000 milliseconds = 60 seconds -> every minute, it'll refetch (requery the data) and we'll get the data again
    pollingInterval: 60000,
    // When we focus on another window and then return to our app window, it'll refetch
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // conditionally render contents that will be returned at the end of this function component
  let content;

  // Loader when fetching data
  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  // Display error message when there's an error
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  // If fetching data is successful
  if (isSuccess) {
    // Destructure the ids from the users data object
    const { ids } = users;

    // Contents of the table using the User component
    const tableContent =
      ids?.length && ids.map(userId => <User key={userId} userId={userId} />);

    // Use table with a flatten structure
    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  // Return the content to be rendered
  return content;
};

export default UsersList;
