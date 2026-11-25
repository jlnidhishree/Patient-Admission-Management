
import re
from datetime import date

# Allowed dropdown values
GENDERS = ["Male", "Female", "Other"]

WARDS = [
    "General Ward",
    "ICU",
    "Emergency Ward",
    "Private Ward"
]

DEPARTMENTS = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine"
]

DOCTORS = [
    "Dr. Sharma",
    "Dr. Kumar",
    "Dr. Priya",
    "Dr. Ramesh"
]


def validate_patient(data):

    # Name validation
    name = str(data.get("name", "")).strip()

    if not name:
        return "Patient name is required."

    if not re.fullmatch(r"[A-Za-z]+(?: [A-Za-z]+)*", name):
        return "Name must contain letters only."

    # Age validation
    age = data.get("age")

    if age is None or str(age).strip() == "":
        return "Age is required."

    try:
        if isinstance(age, bool):
            raise ValueError

        age = int(age)

        if str(data.get("age")).strip() != str(age):
            return "Age must be a whole number."

    except (ValueError, TypeError):
        return "Age must be a valid number."

    if age < 0 or age > 120:
        return "Age must be between 0 and 120."

    # Gender validation
    gender = data.get("gender")

    if gender not in GENDERS:
        return "Please select a valid gender."

    # Ward validation
    ward = data.get("ward")

    if ward not in WARDS:
        return "Please select a valid ward."

    # Department validation
    department = data.get("department")

    if department not in DEPARTMENTS:
        return "Please select a valid department."

    # Doctor validation
    doctor = data.get("doctor")

    if doctor not in DOCTORS:
        return "Please select a valid doctor."

    # Admission date validation
    admission_date = data.get("admission_date")

    if not admission_date:
        return "Admission date is required."

    try:
        parsed_date = date.fromisoformat(admission_date)
    except (ValueError, TypeError):
        return "Please enter a valid admission date."

    if parsed_date > date.today():
        return "Admission date cannot be in the future."

    # Status validation
    status = data.get("status", "Admitted")

    if status not in ["Admitted", "Discharged"]:
        return "Please select a valid patient status."

    return None
