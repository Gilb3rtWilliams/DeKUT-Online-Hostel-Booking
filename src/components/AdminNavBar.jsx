import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../authContext";

const AdminNavBar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4">
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/manage-hostels")}>Manage Hostels</button>
        <button onClick={() => navigate("/manage-students")}>Manage Students</button>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavBar;
