
from flask import Flask, request, jsonify
from flask_cors import CORS

from database import get_db_connection, create_table
from validation import (
    validate_patient,
    GENDERS,
    WARDS,
    DEPARTMENTS,
    DOCTORS
)

app = Flask(__name__)
CORS(app)

# Create database table when backend starts
create_table()


# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Patient Admission Management API is running!"
    })


# Get dropdown options
@app.route("/api/options", methods=["GET"])
def get_options():
    return jsonify({
        "genders": GENDERS,
        "wards": WARDS,
        "departments": DEPARTMENTS,
        "doctors": DOCTORS
    })


# Add a new patient
@app.route("/api/patients", methods=["POST"])
def add_patient():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data."
        }), 400

    error = validate_patient(data)

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    conn = get_db_connection()

    cursor = conn.execute("""
        INSERT INTO patients
        (name, age, gender, ward, department, doctor,
         admission_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"].strip(),
        int(data["age"]),
        data["gender"],
        data["ward"],
        data["department"],
        data["doctor"],
        data["admission_date"],
        data.get("status", "Admitted")
    ))

    conn.commit()
    patient_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "message": "Patient added successfully!",
        "id": patient_id
    }), 201


# Get all patients with search and filters
@app.route("/api/patients", methods=["GET"])
def get_patients():
    search = request.args.get("search", "").strip()
    ward = request.args.get("ward", "").strip()
    department = request.args.get("department", "").strip()
    doctor = request.args.get("doctor", "").strip()

    if ward and ward not in WARDS:
        return jsonify({"success": False, "message": "Invalid ward."}), 400

    if department and department not in DEPARTMENTS:
        return jsonify({"success": False, "message": "Invalid department."}), 400

    if doctor and doctor not in DOCTORS:
        return jsonify({"success": False, "message": "Invalid doctor."}), 400

    query = "SELECT * FROM patients WHERE 1=1"
    values = []

    if search:
        query += " AND name LIKE ?"
        values.append(f"%{search}%")

    if ward:
        query += " AND ward = ?"
        values.append(ward)

    if department:
        query += " AND department = ?"
        values.append(department)

    if doctor:
        query += " AND doctor = ?"
        values.append(doctor)

    query += " ORDER BY id DESC"

    conn = get_db_connection()
    patients = conn.execute(query, values).fetchall()
    conn.close()

    return jsonify({
        "success": True,
        "patients": [dict(patient) for patient in patients]
    })


# Get one patient
@app.route("/api/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    conn = get_db_connection()

    patient = conn.execute(
        "SELECT * FROM patients WHERE id = ?",
        (patient_id,)
    ).fetchone()

    conn.close()

    if patient is None:
        return jsonify({
            "success": False,
            "message": "Patient not found."
        }), 404

    return jsonify({
        "success": True,
        "patient": dict(patient)
    })


# Edit patient details
@app.route("/api/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data."
        }), 400

    error = validate_patient(data)

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    conn = get_db_connection()

    existing = conn.execute(
        "SELECT id FROM patients WHERE id = ?",
        (patient_id,)
    ).fetchone()

    if existing is None:
        conn.close()
        return jsonify({
            "success": False,
            "message": "Patient not found."
        }), 404

    conn.execute("""
        UPDATE patients
        SET name = ?, age = ?, gender = ?, ward = ?,
            department = ?, doctor = ?, admission_date = ?,
            status = ?
        WHERE id = ?
    """, (
        data["name"].strip(),
        int(data["age"]),
        data["gender"],
        data["ward"],
        data["department"],
        data["doctor"],
        data["admission_date"],
        data.get("status", "Admitted"),
        patient_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Patient updated successfully!"
    })


# Delete patient
@app.route("/api/patients/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    conn = get_db_connection()

    cursor = conn.execute(
        "DELETE FROM patients WHERE id = ?",
        (patient_id,)
    )

    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({
            "success": False,
            "message": "Patient not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Patient deleted successfully!"
    })


# Mark patient as discharged
@app.route("/api/patients/<int:patient_id>/discharge", methods=["PATCH"])
def discharge_patient(patient_id):
    conn = get_db_connection()

    cursor = conn.execute("""
        UPDATE patients
        SET status = 'Discharged'
        WHERE id = ? AND status = 'Admitted'
    """, (patient_id,))

    conn.commit()
    updated = cursor.rowcount
    conn.close()

    if updated == 0:
        return jsonify({
            "success": False,
            "message": "Patient not found or already discharged."
        }), 404

    return jsonify({
        "success": True,
        "message": "Patient discharged successfully!"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
