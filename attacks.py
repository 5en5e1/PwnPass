


def find_row_in_binary_file(file_path, target,lines,results):

    # Convert target_row to bytes and strip extra spaces/newlines
    target_bytes = [row.strip().encode('utf-8') for row in target]

    try:

        with (open(f'wordlists/{file_path}', "rb") as file):  # Open in binary mode
            for line_number, line in enumerate(file, start=1):
                # Strip each binary line for comparison
                line = line.strip()

                if line in target_bytes:  # Compare as bytes
                    print(line,target_bytes)
                    results[line.decode('utf-8')] = lines # Map the line (target) to its line number
                    target_bytes.remove(line)  # Remove the matched target row
                if not target_bytes:

                    return target_bytes


                lines=lines+1
            return target_bytes


    except FileNotFoundError:
        print(f"File {file_path} not found.")
    lines=0
    return -1  # Return -1 if the row is not found

def dictionary(passwords,custom_wordlist):
    lines=0
    # Predefined list of file paths

    if custom_wordlist is not None:
        file_paths = [
            custom_wordlist
        ]

    else:
        file_paths = [

            "Ashley-Madison.txt",
            "piotrcki-wordlist-top10m.txt",
            "piotrcki-wordlist.txt"
        ]

    # Row to search for


    found = False
    print("dictionaire...")
    results_dict={}
    result=[]
    for file_path in file_paths:
        print(f"Searching in {file_path}...")
        result = find_row_in_binary_file(file_path, passwords,lines,results_dict)
        print(result)
        if not result:
            print(f"Rows found in {file_path} at line {result}")
            found = True
            lines=0
            return  results_dict


    if result:
        lines = 0
        for password in result:
            results_dict[password.decode('utf-8')]=-1
        print(results_dict)
        print("Row not found in any of the specified files.")
        return  results_dict



def brute_force(passwords, charset):

    results = {}

    charset_size = len(charset)
    for password in passwords:

        n = len(password)
        total_combinations = 0

        for k in range(1, n):  # De la 1 la n-1
            total_combinations += charset_size ** k

        for i, char in enumerate(password):
            char_position = charset.index(char)
            total_combinations += char_position * (charset_size ** (n - i - 1))

        results[password]= total_combinations + 1
    return results