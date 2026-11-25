
import sqlite3
from pathlib import Path

# Database file location
BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "patients.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            ward TEXT NOT NULL,
            department TEXT NOT NULL,
            doctor TEXT NOT NULL,
            admission_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Admitted'
        )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_table()
    print("Patient database and table created successfully!")
