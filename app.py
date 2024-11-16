from hashlib import algorithms_available
from time import process_time

from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from calculator import time_calculator
import sqlite3
import os
import time
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Function to connect to the SQLite database
def get_db_connection():
    connection = sqlite3.connect('cpus.db')  # Replace with your database file
    connection.row_factory = sqlite3.Row  # Allows dict-like access to rows
    return connection

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        custom_wordlist = None
        # Get the 'password' from the POST body

        if 'file' in request.files:
           print('file received')
           file = request.files['file']
           if file.filename != '':
               if  file.filename.endswith('.txt'):
                   save_directory = 'wordlists'
                   os.makedirs(save_directory, exist_ok=True)  # Ensure the directory exists
                   file_path = os.path.join(save_directory, file.filename)
                   file.save(file_path)  # Save the file directly
                   custom_wordlist = file.filename
               else:
                   custom_wordlist = None

        passwords = request.form.get('passwords')
        if not passwords:
            return jsonify({"error": "Missing 'password' in POST body"}), 400


        passwords =  passwords.splitlines()
        # Get other parameters from GET query string
        cpu_id = request.args.get('cpu_id')  # Example query parameter
        algorithms = request.args.getlist('algorithms')  # Another query parameter
        alphabet = request.args.getlist('alphabet')   # Another query parameter
        # Validate required GET parameters
        if not  cpu_id or not algorithms or not alphabet:
            return jsonify({"error": "Missing required query parameters: 'param1' and 'param2'"}), 400



        # Create a new connection and cursor for this request
        connection = get_db_connection()
        cursor = connection.cursor()

        columns = ', '.join(algorithms)

        # Get CPU names
        cursor.execute(f"SELECT {columns} FROM CPUs WHERE id={cpu_id}")
        cpu_hs = cursor.fetchone()
        # Extract the single value

        cursor.execute(f"SELECT cpu_name FROM CPUs WHERE id={cpu_id}")
        cpu_name = cursor.fetchone()

            # Close the connection
        connection.close()



        # Convert the result into a dictionary
        cpu_dict = dict(zip(algorithms, cpu_hs))
        # Call the time_calculator function with parameters
        # Example: Casting query params to integers if needed
        result = time_calculator(passwords,cpu_dict,alphabet,custom_wordlist)
        print(result)
        print("--------------------")
        result["cpu_name"]= cpu_name[0]
        print(result)
        # Return the result as a JSON response
        return jsonify(result)
    except Exception as e:
        # Handle any potential errors
        return jsonify({"error": str(e)}), 500

@app.route('/info', methods=['GET'])
def info():
    try:
        # Create a new connection and cursor for this request
        connection = get_db_connection()
        cursor = connection.cursor()

        # Get column names from the table
        cursor.execute(f"PRAGMA table_info(CPUs)")
        columns_info = cursor.fetchall()
        algorithms = [column["name"] for column in columns_info[2:]]  # Skip the first column

        # Get CPU names
        cursor.execute("SELECT id,cpu_name FROM CPUs")

        cpu_names = [{row[0]: row[1]} for row in cursor.fetchall()]
        print(cpu_names)
        # Close the connection
        connection.close()

        # Return the results as JSON
        return jsonify({"algorithms": algorithms, "cpu_names": cpu_names})


    except Exception as e:
        # Handle any potential errors
        return jsonify({"error": str(e)}), 500



@app.route('/benchmark', methods=['GET'])
def benchmark():
    try:
        # Create a new connection and cursor for this request
        connection = get_db_connection()
        cursor = connection.cursor()

        # Get column names from the table
        cursor.execute(f"PRAGMA table_info(CPUs)")
        columns_info = cursor.fetchall()
        algorithms = [column["name"] for column in columns_info[2:]]  # Skip the first column

        # Get CPU names
        cursor.execute("SELECT * FROM CPUs")

        cpu_s =cursor.fetchall()
        cpu_dicts = [dict(row) for row in cpu_s]



        # Close the connection
        connection.close()

        # Return the results as JSON
        return jsonify(cpu_dicts)


    except Exception as e:
        # Handle any potential errors
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run('0.0.0.0', 5000)
