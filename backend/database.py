
import os
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db_connection():
    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL environment variable is not set."
        )

    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row
    )


def create_table():
    conn = get_db_connection()

    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(20) NOT NULL,
                ward VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                doctor VARCHAR(100) NOT NULL,
                admission_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Admitted'
            )
        """)
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    create_table()
    print("PostgreSQL database and patients table created successfully!")
