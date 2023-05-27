import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";

// Regex patterns for username and password
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  // Custom hook to set the page title
  useTitle("Meganote: New User");

  // Get the function "addNewUser" and the object that includes the statuses after we call that function from the custom RTK Query hook
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  // Custom hook to navigate to a different page -> from React Router
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  // Side effects to validate username and password with the Regex patterns
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // Side effect that runs if the user was successfully added
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]); // Putting 'navigate' as part of the dependencies here to remove a warning

  // Event handlers
  const onUsernameChanged = e => setUsername(e.target.value);

  const onPasswordChanged = e => setPassword(e.target.value);

  const onRolesChanged = e => {
    // Create a values array from the selected options (These options are a HTML Collection)
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection
      option => option.value
    );
    setRoles(values);
  };

  // If all the fields are valid (roles.length, validUsername, validPassword are all true) and the user is not being added, then the save button is enabled
  // Can also use 'if(roles.length && validUsername && validPassword)'
  // The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
  // Any object, including a Boolean object whose value is false, evaluates to true when passed to a conditional statement
  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async e => {
    // Calling preventDefault() during any stage of event flow cancels the event, meaning that any default action normally taken by the implementation as a result of the event will not occur
    e.preventDefault();
    // Run the addNewUser function from the RTK Query custom hook if canSave is true. The new user will be added with the entered username, password, and roles
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  // The options in the drop-down menu for User Roles
  const options = Object.values(ROLES).map(role => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });

  // Classes that we may or may not want to apply to the form elements
  const errClass = isError ? "errmsg" : "offscreen";
  // If validUsername is false, the username or password or the roles are not valid, outline in red with the added CSS class and highlight that these need to be completed
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !roles.length ? "form__input--incomplete" : "";

  // Content to be rendered
  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewUserForm;
