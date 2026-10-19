# College Management System

A web-based College Management System developed using **Node.js, Express.js, MongoDB, and Mongoose**. This project manages student records, performs CRUD operations, and generates department-wise reports.

## Features

- **Add Students:** Register students with their ID, name, email, department, course, and year.
- **View Students:** Display all student records.
- **Search Students:** Search for student records using the available student details.
- **Update Students:** Edit existing student information.
- **Delete Students:** Remove student records.
- **Department-wise Reports:** Generate a report showing the number of students in each department.
- **CSV Export:** Export student records to a CSV file.
- **Dashboard:** Display total students and the number of departments.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Environment Variables:** dotenv

## Project Structure

```text
college-management-system/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env                 # Local configuration; not uploaded
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account and database

### 1. Clone the repository

```bash
git clone https://github.com/Anoma72/college-management-system.git
cd college-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add:

```text
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Replace the placeholder with your own MongoDB Atlas connection string. Do not share or commit your database credentials.

### 4. Start the application

```bash
node server.js
```

Open the following URL in your browser:

http://localhost:5000

## CRUD Operations

| Operation | Description |
|---|---|
| Create | Add a new student |
| Read | View and search student records |
| Update | Edit student information |
| Delete | Delete a student record |

## Report Generation

The application uses MongoDB aggregation to group student records by department and calculate the total number of students in each department.

## Purpose

This project demonstrates the practical implementation of database connectivity, CRUD operations, web development, and report generation using MongoDB.

## Author

**Anoma Mhaiskar**

PCCOER — Information Technology

## Future Enhancements

- Student attendance management
- Course and faculty management
- Authentication and role-based access
- PDF report generation
- Online deployment
