import sqlite3

# Create or connect to the SQLite database
connection = sqlite3.connect('repeat.db')  # Replace with your database name
cursor = connection.cursor()

# Ensure the table exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS password_repeat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL UNIQUE,  -- UNIQUE to prevent duplicate entries
    count INTEGER NOT NULL
);
""")
connection.commit()

file_paths = [
    "Ashley-Madison.txt",
    "piotrcki-wordlist-top10m.txt",
    "piotrcki-wordlist.txt"
]

# Parameters for batching
batch_size = 1000000  # Number of passwords per batch
batch = []  # Temporary storage for the batch
counter = 0  # Total record counter

# Process each file
for file_path in file_paths:
    print(f"Processing: {file_path}")
    try:
        with open(f'wordlists/{file_path}', "rb") as file:  # Open in binary mode
            for line in file:
                # Decode and strip each line
                try:
                    line = line.strip().decode("utf-8")
                    if len(line)>8  :

                        # Add the password to the batch
                        batch.append((line,))

                        # If batch size is reached, execute and commit
                        if len(batch) >= batch_size:
                            cursor.executemany("""
                            INSERT INTO password_repeat (password, count)
                            VALUES (?, 1)
                            ON CONFLICT(password) DO UPDATE SET count = count + 1;
                            """, batch)
                            connection.commit()
                            counter += len(batch)
                            print(f"Committed {counter} records so far...")
                            batch = []  # Clear the batch
                except:
                  pass
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")

# Insert any remaining passwords in the batch
if batch:
    cursor.executemany("""
    INSERT INTO password_repeat (password, count)
    VALUES (?, 1)
    ON CONFLICT(password) DO UPDATE SET count = count + 1;
    """, batch)
    connection.commit()
    counter += len(batch)
    print(f"Committed final batch of {len(batch)} records.")

# Close the connection
connection.close()
print(f"Processing completed. Total records processed: {counter}")
