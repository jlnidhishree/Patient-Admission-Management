# Patient Admission Management System

A web-based application designed to help hospital staff efficiently manage patient admission records, monitor patient status, and maintain patient information.

## Live Application

- **Frontend:** https://patient-admission-management-lac.vercel.app
- **Backend API:** https://patient-admission-api-coj1.onrender.com
- **GitHub Repository:** https://github.com/jlnidhishree/Patient-Admission-Management

## Project Overview

The Patient Admission Management System provides a simple and user-friendly interface for managing hospital patient records. It allows hospital staff to add, view, search, filter, update, and delete patient information while tracking admission and discharge status.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Axios

### Backend
- Python
- Flask
- Flask-CORS
- Gunicorn

### Database
- PostgreSQL

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting and PostgreSQL database

## Features

- Add new patient records
- View all patient records
- Search patients by name
- Filter patients by ward, department, and doctor
- Edit patient information
- Delete patient records with confirmation
- Mark patients as discharged
- Dashboard statistics showing total, admitted, and discharged patients
- Responsive user interface
- Frontend and backend validation
- Persistent database storage

## Patient Information

The application manages the following patient details:

- Patient Name
- Age
- Gender
- Ward
- Department
- Doctor
- Admission Date
- Admission Status (Admitted / Discharged)

## Project Structure

```text
Patient-Admission-Management/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── validation.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PatientForm.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jlnidhishree/Patient-Admission-Management.git
cd Patient-Admission-Management
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the PostgreSQL database connection using the `DATABASE_URL` environment variable.

For local development, create a `.env` file or configure the environment variable in your terminal. Do not upload database credentials to GitHub.

Start the Flask backend:

```bash
python app.py
```

Backend URL:

`http://127.0.0.1:5000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:5000
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Validation

The application implements frontend and backend validation for:

- Required patient information
- Patient name format (letters only)
- Age between 0 and 120
- Valid gender, ward, department, and doctor selections
- Valid admission date
- Admission date cannot be in the future

## Deployment

- Frontend deployed using Vercel.
- Flask backend deployed using Render.
- PostgreSQL database hosted on Render.
- Frontend communicates with the backend through REST API endpoints.

## Developer

**Nidhi Shree**  
Information Science and Engineering  
Vemana Institute of Technology
