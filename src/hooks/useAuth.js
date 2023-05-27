import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";

  if (token) {
    // decode the token
    const decoded = jwtDecode(token);
    // get the username and roles from the decoded token
    const { username, roles } = decoded.UserInfo;

    // Check for the roles in the roles array
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    // Check for the highest role and set it to the user status - 'Admin' is the highest role
    // Whatever is stored in 'status' is the highest role available to that user
    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
};

export default useAuth;
