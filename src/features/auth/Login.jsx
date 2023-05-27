import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const Login = () => {
  // Custom hook to set the page title
  useTitle("Employee Login");

  // Refs to set focus on user inputs
  const userRef = useRef();
  // To set the focus if there's an error
  const errRef = useRef();

  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // For persistent login
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the 'login' function and the statuses after it is run from the custom RTK Query hook
  const [login, { isLoading }] = useLoginMutation();

  // Side effect to run when the component mounts, putting the focus on the username field
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Side effect to clear out the existing error message when users make changes to the username and password input field
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  // Event handlers
  const handleSubmit = async e => {
    // The default form action is to reload the page, so we're preventing that
    e.preventDefault();
    try {
      // Using 'unwrap' because we're not using the error states
      // 'unwrap' returns the data object
      // The unwrap() method removes the element's parent and returns the unwrapped content
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      // Reset the username and password in the form after logging in successfully
      setUsername("");
      setPassword("");
      // Take the user to the dash after loggin in
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response!");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password!");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized!");
      } else {
        setErrMsg(err.data?.message);
      }
      // Set the focus on the error message
      // This would also be read on a screen reader as well because we're putting 'aria-live=assertive' in the error message <p>
      errRef.current.focus();
    }
  };

  // Set username and password to the values entered by the user
  const handleUserInput = e => setUsername(e.target.value);
  const handlePwdInput = e => setPassword(e.target.value);

  // Handle the toggle of persistent login
  // Set the value of 'persist' to the opposite of its current value (for the checkbox)
  const handleToggle = () => setPersist(prev => !prev);

  // Class for error message
  const errClass = errMsg ? "errmsg" : "offscreen";

  // Loading spinner when the 'login' function is called
  if (isLoading) return <PulseLoader color={"#FFF"} />;

  // Content to be rendered
  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Stay Signed In
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
