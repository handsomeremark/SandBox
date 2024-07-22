import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MdEdit, MdDelete } from "react-icons/md";

export default function BasicTable({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ email: "", gender: "" });

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

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="center">Actions</TableCell>
            <TableCell>Gender</TableCell> {/* Ensure Gender header is present */}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell component="th" scope="row">
                {editingUser === user.email ? (
                  <TextField
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell align="center">
                {editingUser === user.email ? (
                  <div className="flex justify-center space-x-2">
                    <Button
                      type="button"
                      onClick={handleEditSubmit}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => handleEditClick(user)}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                      <MdEdit className="mb-1" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(user.email)}
                      variant="contained"
                      size="small"
                    >
                      Delete
                      <MdDelete className="mb-1" />
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingUser === user.email ? (
                  <TextField
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  user.gender
                )}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
