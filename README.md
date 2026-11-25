
# Patient Admission Management System

A web-based application to manage hospital patient admission records efficiently.

## Project Overview

The Patient Admission Management System helps hospital staff manage patient information, monitor admission status, and maintain patient records.

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

### Database
- SQLite

## Features

- Add new patient records
- View all patient records
- Search patients by name
- Filter patients by ward, department, and doctor
- Edit patient information
- Delete patient records with confirmation
- Mark patients as discharged
- Dashboard statistics
- Responsive user interface
- Frontend and backend validation

## Patient Information

The application stores:
- Patient Name
- Age
- Gender
- Ward
- Department
- Doctor
- Admission Date
- Admission Status

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
│   │   └── main.jsx
│   └── package.json
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/jlnidhishree/Patient-Admission-Management.git
cd Patient-Admission-Management
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

Backend URL:

http://127.0.0.1:5000

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

http://localhost:5173

## Validation

The application validates:
- Required patient information
- Patient name format
- Age between 0 and 120
- Valid dropdown selections
- Admission date cannot be in the future

Both frontend and backend validation are implemented.

## Developer

Nidhi Shree

Information Science and Engineering
