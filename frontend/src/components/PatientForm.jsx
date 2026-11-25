
import { useState } from "react";

function PatientForm({ options = {}, onClose, onSave, initialData }) {
  const genders = options.genders || [];
  const wards = options.wards || [];
  const departments = options.departments || [];
  const doctors = options.doctors || [];

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    age: initialData?.age ?? "",
    gender: initialData?.gender || "",
    ward: initialData?.ward || "",
    department: initialData?.department || "",
    doctor: initialData?.doctor || "",
    admission_date: initialData?.admission_date || "",
    status: initialData?.status || "Admitted"
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formData.name.trim())) {
      setError("Name must contain letters only.");
      return;
    }

    if (
      formData.age === "" ||
      !/^\d+$/.test(String(formData.age)) ||
      Number(formData.age) < 0 ||
      Number(formData.age) > 120
    ) {
      setError("Age must be a whole number between 0 and 120.");
      return;
    }

    if (
      !genders.includes(formData.gender) ||
      !wards.includes(formData.ward) ||
      !departments.includes(formData.department) ||
      !doctors.includes(formData.doctor) ||
      !formData.admission_date
    ) {
      setError("Please select all required fields.");
      return;
    }

    if (formData.admission_date > today) {
      setError("Admission date cannot be in the future.");
      return;
    }

    try {
      setSaving(true);

      const result = await onSave({
        ...formData,
        name: formData.name.trim(),
        age: Number(formData.age)
      });

      if (result) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const optionsLoading =
    genders.length === 0 ||
    wards.length === 0 ||
    departments.length === 0 ||
    doctors.length === 0;

  return (
    <div className="modal-overlay">
      <div className="patient-form-modal">

        <div className="form-header">
          <div>
            <h2>{initialData ? "Edit Patient" : "Add New Patient"}</h2>
            <p>Enter the patient admission details</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {optionsLoading ? (
          <p className="form-error">
            Loading dropdown options. Please wait...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter patient name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  max="120"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  {genders.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Ward *</label>
                <select name="ward" value={formData.ward} onChange={handleChange} required>
                  <option value="">Select Ward</option>
                  {wards.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {departments.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Doctor *</label>
                <select name="doctor" value={formData.doctor} onChange={handleChange} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Admission Date *</label>
                <input
                  type="date"
                  name="admission_date"
                  max={today}
                  value={formData.admission_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="save-button" disabled={saving}>
                {saving ? "Saving..." : initialData ? "Update Patient" : "Save Patient"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default PatientForm;
