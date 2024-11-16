import sqlite3

# Database file name
db_file = "cpus.db"

def add_cpu(cpu_name, argon2=None, bcrypt=None, scrypt=None, md5=None, sha1=None, sha256=None, sha512=None, sha3_256=None, sha3_512=None):
    """
    Adds a new CPU entry to the CPUs table.
    """
    try:
        # Connect to the database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        # Insert query
        cursor.execute("""
            INSERT INTO CPUs (cpu_name, argon2, bcrypt, scrypt, md5, sha1, sha256, sha512, sha3_256, sha3_512)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (cpu_name, argon2, bcrypt, scrypt, md5, sha1, sha256, sha512, sha3_256, sha3_512))



        # Commit the changes and close the connection
        conn.commit()
        print(f"Successfully added CPU: {cpu_name}")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

# Example usage
if __name__ == "__main__":
    # Add some rows
    add_cpu("Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz", argon2=13.56,scrypt=19.80, bcrypt=3.46, md5=209715.20,sha1=149796.57,sha256=182361.04,sha512=524288.00,sha3_256=599186.29,sha3_512=838860.80)
    # Add more CPUs as needed
