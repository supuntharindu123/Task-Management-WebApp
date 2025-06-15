// userActions.js

// Get all users
export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }
};

// Update a user
export const updateUser = async (id, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return { success: true, id };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
};
