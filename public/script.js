
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const cancelButton = document.getElementById("cancelButton");

let students = [];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function loadStudents() {
  try {
    students = await request("/api/students");
    renderStudents();
    updateDashboard();
  } catch (error) {
    alert("Could not load students: " + error.message);
  }
}

function renderStudents() {
  const query = searchInput.value.toLowerCase();

  const filtered = students.filter(student =>
    [
      student.studentId,
      student.name,
      student.email,
      student.department,
      student.course
    ].some(value => String(value).toLowerCase().includes(query))
  );

  tableBody.innerHTML = filtered.map(student => `
    <tr>
      <td>${escapeHTML(student.studentId)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.email)}</td>
      <td>${escapeHTML(student.department)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>${escapeHTML(student.year)}</td>
      <td>
        <button type="button" onclick="editStudent('${student._id}')">Edit</button>
        <button type="button" class="delete"
          onclick="deleteStudent('${student._id}')">Delete</button>
      </td>
    </tr>
  `).join("");

  document.getElementById("emptyMessage").hidden = filtered.length > 0;
}

function updateDashboard() {
  document.getElementById("totalStudents").textContent = students.length;

  const departments = new Set(students.map(student => student.department));
  document.getElementById("totalDepartments").textContent = departments.size;
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const id = document.getElementById("studentDbId").value;

  const student = {
    studentId: document.getElementById("studentId").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value,
    course: document.getElementById("course").value.trim(),
    year: Number(document.getElementById("year").value)
  };

  try {
    if (id) {
      await request("/api/students/" + id, {
        method: "PUT",
        body: JSON.stringify(student)
      });
      alert("Student updated successfully!");
    } else {
      await request("/api/students", {
        method: "POST",
        body: JSON.stringify(student)
      });
      alert("Student added successfully!");
    }

    resetForm();
    await loadStudents();
  } catch (error) {
    alert("Could not save student: " + error.message);
  }
});

function editStudent(id) {
  const student = students.find(item => item._id === id);
  if (!student) return;

  document.getElementById("studentDbId").value = student._id;
  document.getElementById("studentId").value = student.studentId;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("department").value = student.department;
  document.getElementById("course").value = student.course;
  document.getElementById("year").value = student.year;

  document.getElementById("formTitle").textContent = "Edit Student";
  document.getElementById("saveButton").textContent = "Update Student";
  cancelButton.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    await request("/api/students/" + id, { method: "DELETE" });
    await loadStudents();
  } catch (error) {
    alert("Could not delete student: " + error.message);
  }
}

function resetForm() {
  form.reset();
  document.getElementById("studentDbId").value = "";
  document.getElementById("formTitle").textContent = "Add New Student";
  document.getElementById("saveButton").textContent = "Add Student";
  cancelButton.hidden = true;
}

cancelButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);

document.getElementById("reportButton").addEventListener("click", async () => {
  try {
    const report = await request("/api/reports/departments");

    document.getElementById("reportOutput").innerHTML = `
      <h3>Department Report</h3>
      <table>
        <thead><tr><th>Department</th><th>Total Students</th></tr></thead>
        <tbody>
          ${report.map(item => `
            <tr>
              <td>${escapeHTML(item._id)}</td>
              <td>${escapeHTML(item.totalStudents)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    alert("Could not generate report: " + error.message);
  }
});

document.getElementById("csvButton").addEventListener("click", () => {
  const columns = [
    "studentId", "name", "email", "department", "course", "year"
  ];

  const csvCell = value =>
    '"' + String(value ?? "").replace(/"/g, '""') + '"';

  const rows = [
    columns.join(","),
    ...students.map(student =>
      columns.map(column => csvCell(student[column])).join(",")
    )
  ];

  const blob = new Blob(["\uFEFF" + rows.join("\r\n")], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "College_Student_Report.csv";
  link.click();
  URL.revokeObjectURL(url);
});

loadStudents();
