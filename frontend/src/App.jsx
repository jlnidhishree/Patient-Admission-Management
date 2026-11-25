
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import PatientForm from "./components/PatientForm";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function App() {
  const [patients, setPatients] = useState([]);

  const [options, setOptions] = useState({
    genders: [],
    wards: [],
    departments: [],
    doctors: []
  });

  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Load dropdown options
  useEffect(() => {
    axios.get(`${API}/api/options`)
      .then(response => setOptions(response.data))
      .catch(() => setError("Could not load dropdown options."));
  }, []);

  // Load patients whenever search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, ward, department, doctor]);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/api/patients`, {
        params: { search, ward, department, doctor }
      });

      setPatients(response.data.patients);

    } catch (err) {
      setError("Unable to load patients. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Add or update patient
  const savePatient = async (patientData) => {
    try {
      if (editingPatient) {
        await axios.put(
          `${API}/api/patients/${editingPatient.id}`,
          patientData
        );

        alert("Patient updated successfully!");
      } else {
        await axios.post(`${API}/api/patients`, patientData);

        alert("Patient added successfully!");
      }

      setEditingPatient(null);
      await fetchPatients();

      return true;

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to save patient. Please try again."
      );

      return false;
    }
  };

  // Open edit form
  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  // Delete patient
  const handleDelete = async (patient) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/patients/${patient.id}`);

      alert("Patient deleted successfully!");
      await fetchPatients();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to delete patient."
      );
    }
  };

  // Discharge patient
  const handleDischarge = async (patient) => {
    const confirmDischarge = window.confirm(
      `Are you sure you want to discharge ${patient.name}?`
    );

    if (!confirmDischarge) return;

    try {
      await axios.patch(
        `${API}/api/patients/${patient.id}/discharge`
      );

      alert("Patient discharged successfully!");
      await fetchPatients();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to discharge patient."
      );
    }
  };

  // Open add form
  const handleAdd = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  // Close form
  const closePatientForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  // Dashboard statistics
  const totalPatients = patients.length;

  const admittedPatients = patients.filter(
    patient => patient.status === "Admitted"
  ).length;

  const dischargedPatients = patients.filter(
    patient => patient.status === "Discharged"
  ).length;

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <span className="logo-icon">✚</span>
          <h2>CarePoint</h2>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <div className="menu-item active">
          <span>▦</span> Dashboard
        </div>

        <div className="menu-item">
          <span>♙</span> Patients
        </div>

        <div className="sidebar-footer">
          <p>Patient Admission</p>
          <small>Management System</small>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header className="topbar">

          <div>
            <h2>Dashboard</h2>
            <p>Welcome to Patient Admission Management</p>
          </div>

          <div className="admin-profile">
            <div className="avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <small>Hospital Staff</small>
            </div>
          </div>

        </header>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">♙</div>
            <p>Total Patients</p>
            <h2>{totalPatients}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Admitted Patients</p>
            <h2>{admittedPatients}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">↗</div>
            <p>Discharged Patients</p>
            <h2>{dischargedPatients}</h2>
          </div>

        </section>

        {/* Patient Management */}
        <section className="patient-section">

          <div className="section-header">

            <div>
              <h2>Patient Management</h2>
              <p>Manage and monitor hospital patient records</p>
            </div>

            <button
              className="add-button"
              onClick={handleAdd}
            >
              + Add Patient
            </button>

          </div>

          {/* Search and Filters */}
          <div className="filter-container">

            <input
              type="text"
              placeholder="Search patients by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={ward}
              onChange={e => setWard(e.target.value)}
            >
              <option value="">All Wards</option>

              {options.wards.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>

              {options.departments.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={doctor}
              onChange={e => setDoctor(e.target.value)}
            >
              <option value="">All Doctors</option>

              {options.doctors.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* Error Message */}
          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* Patient Table */}
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Ward</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td colSpan="10" className="empty-message">
                      Loading patients...
                    </td>
                  </tr>

                ) : patients.length === 0 ? (

                  <tr>
                    <td colSpan="10" className="empty-message">
                      No patients found. Add your first patient!
                    </td>
                  </tr>

                ) : (

                  patients.map(patient => (

                    <tr key={patient.id}>

                      <td>#{patient.id}</td>

                      <td>
                        <strong>{patient.name}</strong>
                      </td>

                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.ward}</td>
                      <td>{patient.department}</td>
                      <td>{patient.doctor}</td>
                      <td>{patient.admission_date}</td>

                      <td>
                        <span className={`status ${patient.status.toLowerCase()}`}>
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() => handleEdit(patient)}
                          >
                            Edit
                          </button>

                          {patient.status === "Admitted" && (
                            <button
                              className="discharge-button"
                              onClick={() => handleDischarge(patient)}
                            >
                              Discharge
                            </button>
                          )}

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(patient)}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* Add / Edit Patient Form */}
        {showForm && (

          <PatientForm
            options={options}
            initialData={editingPatient}
            onClose={closePatientForm}
            onSave={savePatient}
          />

        )}

      </main>

    </div>
  );
}

export default App;
