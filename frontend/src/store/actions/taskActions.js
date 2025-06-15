// taskActions.js

// Get All Tasks
export const getTasks = async (filters = {}) => {
  try {
    const response = await fetch(`/api/tasks?${new URLSearchParams(filters)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: error.message };
  }
};

// Create Task
export const createTask = async (taskData) => {
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: error.message };
  }
};

// Update Task
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: error.message };
  }
};

// Delete Task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: error.message };
  }
};

// Generate PDF Report
export const generateTaskPDF = async () => {
  try {
    const response = await fetch("/api/tasks/generate-pdf", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to generate PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks-report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    return { success: true };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, error: error.message };
  }
};
