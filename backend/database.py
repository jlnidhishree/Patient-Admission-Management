
import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Use deployment storage when configured; otherwise use local database
DATABASE = Path(
    os.environ.get("DATABASE_PATH", str(BASE_DIR / "patients.db"))
)

def get_db_connection():
    DATABASE.parent.mkdir(parents=True, exist_ok=True)

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
