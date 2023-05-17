import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NoteList from "./features/notes/NoteList";
import UserList from "./features/users/UserList";
import { store } from "./app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NoteList />} />
          </Route>
          <Route path="users">
            <Route index element={<UserList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
