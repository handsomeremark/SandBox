import React, { useState, useEffect } from "react";
import SideBar from '../components/SideBar';
import UserCountWidget from '../components/UserCountWidget';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ email: "", gender: "" });

  useEffect(() => {
    if (activeSection === "Users") {
      fetchUserData();
    }
  }, [activeSection]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setEditFormData({ email: user.email, gender: user.gender });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/${editingUser}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFormData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUsers = users.map((user) => {
        if (user.email === editingUser) {
          return { ...user, ...editFormData };
        }
        return user;
      });
      setUsers(updatedUsers);
      setEditingUser(null);
      setEditFormData({ email: "", gender: "" });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({ email: "", gender: "" });
  };

  const handleDeleteClick = async (email) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${email}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.email !== email));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex">
      <SideBar onSectionChange={handleSectionChange} />
      <div className="h-screen flex-1 p-7 relative">
        {activeSection === "Dashboard" && (
          <div className="flex justify-between items-center">
            <UserCountWidget />
          </div>
        )}
        {activeSection === "Users" && (
          <div>
            <table className="min-w-full border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="text-center bg-gray-200 px-4 py-2">Email</th>
                  <th className="text-center bg-gray-200 px-4 py-2">Gender</th>
                  <th className="text-center bg-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingUser === user.email ? (
                        <input
                          type="text"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {editingUser === user.email ? (
                        <input
                          type="text"
                          name="gender"
                          value={editFormData.gender}
                          onChange={handleEditChange}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        user.gender
                      )}
                    </td>
                    <td className="flex justify-center border border-gray-300 px-4 py-2">
                      {editingUser === user.email ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-4 py-1 rounded mr-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleEditSubmit}
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="bg-gray-800 hover:bg-slate-400 text-white px-4 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user.email)}
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
