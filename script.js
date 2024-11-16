// passwords Strength Checker Elements
const passwordsInput = document.getElementById('passwords');
const submitpasswordsButton = document.getElementById('submitPassword');
const bruteTime = document.getElementById('bruteTime');
const dictTime = document.getElementById('dictTime');
const cpuTypeSelect = document.getElementById('cpuType');
const warningMessage = document.getElementById('warningMessage');

// Dictionary Upload Elements
const useDefaultButton = document.getElementById('useDefaultButton');
const uploadCustomButton = document.getElementById('uploadCustomButton');
const customDictionarySection = document.getElementById('customDictionarySection');
const dragDropArea = document.getElementById('dragDropArea');
const dictionaryFileInput = document.getElementById('dictionaryFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const uploadButton = document.getElementById('uploadButton');

// Brute Force Character Set Checkboxes
const checkboxes = {
    numbers: document.getElementById('numbers'),
    lowercase_letters: document.getElementById('lowercase_letters'),
    uppercase_letters: document.getElementById('uppercase_letters'),
    special_characters: document.getElementById('special_characters'),
    ascii_extended: document.getElementById('ascii_extended'),
    
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the canvas context
    fetchAlgorithmsAndCPUs()
    const ctxx = document.getElementById("strengthChartdict").getContext("2d");
    const myDoughnutChart = new Chart(ctxx, {
        type: 'doughnut',
        data: {
            labels: [], // Initial labels, updated dynamically
            datasets: [
                {
                    label: 'Algorithm Distribution',
                    data: [], // Initial data, updated dynamically
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', 
                        'rgba(54, 162, 235, 0.6)', 
                        'rgba(255, 206, 86, 0.6)', 
                        'rgba(75, 192, 192, 0.6)', 
                        'rgba(153, 102, 255, 0.6)', 
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });

    window.myDoughnutChart = myDoughnutChart;
    const ctx = document.getElementById("strengthChartbrut").getContext("2d");
    const myDoughnutChart2 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [], // Initial labels, updated dynamically
            datasets: [
                {
                    label: 'Algorithm Distribution',
                    data: [], // Initial data, updated dynamically
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', 
                        'rgba(54, 162, 235, 0.6)', 
                        'rgba(255, 206, 86, 0.6)', 
                        'rgba(75, 192, 192, 0.6)', 
                        'rgba(153, 102, 255, 0.6)', 
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });

     window.myDoughnutChart2 = myDoughnutChart2;

   





    // Create a placeholder chart with dummy data
    
       
});

function updateChart(chart, dictionarySum) {
    // Check if dictionarySum is valid
    if (!dictionarySum || typeof dictionarySum !== 'object' || Object.keys(dictionarySum).length === 0) {
        console.error("dictionarySum is invalid or empty:", dictionarySum);
        return;
    }

    // Validate the chart structure
    if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
        console.error("Chart structure is missing datasets or labels!");
        return;
    }

    // Extract keys (labels) and values (data) from dictionarySum
    const labels = Object.keys(dictionarySum).map(
        key => `${key} - ${dictionarySum[key]}s` // Combine key and raw value
    );
    const rawData = Object.values(dictionarySum); // Raw total seconds for each algorithm

    // Check if rawData has valid numbers
    if (rawData.length === 0 || !rawData.every(value => typeof value === 'number')) {
        console.error("dictionarySum contains invalid data:", dictionarySum);
        return;
    }

    // Calculate the total sum of all values
    const total = rawData.reduce((sum, value) => sum + value, 0);

    // Handle cases where total is 0 or less than 1 second
    if (total <= 1) {
        console.warn("Total sum of data is zero or less than a second. Setting equal percentages.");
        const uniformPercentage = 100 / rawData.length;
        chart.data.labels = labels;
        chart.data.datasets[0].data = rawData.map(() => uniformPercentage); // Equal percentages
        chart.update();
        return;
    }

    // Convert raw values to percentages
    const percentageData = rawData.map(value => (value / total) * 100);

    // Update chart labels and data
    chart.data.labels = labels; // Updated labels with values
    chart.data.datasets[0].data = percentageData;

    // Update the chart
    chart.update();
}

function renderTable(data, title) {
    if (!data || data.length === 0) return;

    // Determine all unique columns
    const allColumns = new Set();
    data.forEach(row => {
        Object.keys(row).forEach(key => allColumns.add(key));
    });

    // Convert columns to an array and sort them, putting "" first
    const columnOrder = ["password", ...[...allColumns].filter(col => col !== "password").sort()];

    // Create table container
    const tablesContainer = document.getElementById('tables-container');
    const tableTitle = document.createElement('h2');
    tableTitle.textContent = title;
    tablesContainer.appendChild(tableTitle);

    const table = document.createElement('table');

    // Add table header
    const headerRow = document.createElement('tr');
    columnOrder.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add table rows
    data.forEach(rowData => {
        const row = document.createElement('tr');
        columnOrder.forEach(col => {
            const td = document.createElement('td');
            td.textContent = rowData[col] !== undefined ? rowData[col] : ''; // Add empty string for missing columns
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    // Append the table to the container
    tablesContainer.appendChild(table);
}



// Update Submit Button State
function updateSubmitButtonState() {
    const passwords = passwordsInput.value;
    const atLeastOneCheckbox = Object.values(checkboxes).some((checkbox) => checkbox.checked);
    const cpuSelected = cpuTypeSelect.value !== '';

    // Enable the button if all conditions are met
    submitpasswordsButton.disabled = !(passwords && atLeastOneCheckbox && cpuSelected);
}

// Listen for changes in passwords, checkboxes, CPU, and encryption selections
passwordsInput.addEventListener('input', updateSubmitButtonState);
Object.values(checkboxes).forEach((checkbox) =>
    checkbox.addEventListener('change', updateSubmitButtonState)
);
cpuTypeSelect.addEventListener('change', updateSubmitButtonState);

// passwords Submission with Fetch API
submitpasswordsButton.addEventListener('click', async () => {
   
    const passwords = passwordsInput.value;
    const selectedCharacterSets = Object.keys(checkboxes)
        .filter((key) => checkboxes[key].checked)
        .map((key) => key); // Gather selected character sets
 
    const cpuType = cpuTypeSelect.value;
    if (!passwords || !cpuType || selectedCharacterSets.length === 0) {
        alert('Please fill out all fields and select at least one character set.');
        return;
    }
    
    // Build the query string
    const queryParams = new URLSearchParams({
        cpu_id:  cpuType, // Replace with dynamic CPU ID if applicable
     
    });

    // Append selected character sets as multiple "alphabet" parameters
    selectedCharacterSets.forEach((alphabet) => queryParams.append('alphabet', alphabet));
    // Get all checkboxes in the container
    const checkboxElements = document.querySelectorAll('#algorithms-container input[type="checkbox"]');

    // Loop through each checkbox
    checkboxElements.forEach((checkbox) => {
        if (checkbox.checked) {
            // Append the checkbox ID to the query parameter
            queryParams.append('algorithms', checkbox.id);
        }
});


    // Construct the full URL with query parameters
    const apiUrl = `http://192.168.248.66:5000/calculate?${queryParams.toString()}`;

    const file = dictionaryFileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('passwords', passwords);
    try {

        const tablesContainer = document.getElementById('tables-container');
                tablesContainer.innerHTML = '';
        // Send POST request to the API
        const response = await fetch(apiUrl, {
            method: 'POST',
          
            body: formData // Include passwords in the request body
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const jsonData = await response.json();
        const algorithmSums = {};
        function calculateAlgorithmSums(dataArray) {
            // Initialize an object to store the sums of each algorithm
            const algorithmSums = {};
        
            // Loop through each entry in the data array
            dataArray.forEach(entry => {
                // Loop through each key-value pair in the entry
                Object.entries(entry).forEach(([key, value]) => {
                    // Check if the key is not 'passwords'
                    if (key !== 'password') {
                        // Initialize the key in the sums object if not already present
                        if (!algorithmSums.hasOwnProperty(key)) {
                            algorithmSums[key] = 0;
                        }
                        // Add the value if it is a number and greater than 0
                        if (typeof value === 'number' && value > 0) {
                            algorithmSums[key] += value;
                        }
                    }
                });
            });
        
            return algorithmSums;
        }
  
        let brute_sum= calculateAlgorithmSums(jsonData.brute_force);
         
      
        
        let dictionary_sum=calculateAlgorithmSums(jsonData.dictionary);
        console.log(dictionary_sum)
        updateChart(window.myDoughnutChart, dictionary_sum);

        updateChart(window.myDoughnutChart2, brute_sum);

        // Generate separate tables for "brute_force" and "dictionary"
        cpuText = document.getElementById("cpu_name_p")
        cpuText.innerHTML= jsonData.cpu_name;
        renderTable(jsonData.brute_force, "Brute Force");
        renderTable(jsonData.dictionary, "Dictionary");
        
    } catch (error) {
        console.error('Error submitting passwords:', error);
        alert('An error occurred while calculating the times.');
    }
});

// Helper Function: Format Time
function formatTime(seconds) {
    if (seconds === 0) return 'Instantaneous'; // Handle 0-time case
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
}


// Toggle Dictionary Option
useDefaultButton.addEventListener('click', () => {
    useDefaultButton.classList.add('selected');
    uploadCustomButton.classList.remove('selected');
    customDictionarySection.classList.remove('show');
    customDictionarySection.classList.add('hidden');
});

uploadCustomButton.addEventListener('click', () => {
    uploadCustomButton.classList.add('selected');
    useDefaultButton.classList.remove('selected');
    customDictionarySection.classList.remove('hidden');
    customDictionarySection.classList.add('show');
});

// Drag-and-Drop Handlers
dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragging');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragging');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragging');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelection(files[0]);
    }
});

// File Input Handler
dictionaryFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
});

// Handle File Selection
function handleFileSelection(file) {
    if (file.type !== 'text/plain') {
        alert('Please upload a valid .txt file.');
        return;
    }

    fileNameDisplay.textContent = `Selected File: ${file.name}`;
}

// Upload Button Click Handler
uploadButton.addEventListener('click', () => {
    const file = dictionaryFileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }

    // Simulate file upload
    alert(`Uploading file: ${file.name}`);
    // Add actual file upload logic here (e.g., API call)
});

// Validate passwords
function validatepasswords(passwords) {
    let validCharacters = '';

    // Combine selected character sets
    Object.keys(checkboxes).forEach((key) => {
        if (checkboxes[key].checked) {
            validCharacters += characterSets[key];
        }
    });

    // Check for invalid characters
    for (const char of passwords) {
        if (!validCharacters.includes(char)) {
            return `Invalid character detected: "${char}". Please use only the selected character sets.`;
        }
    }

    return ''; // No invalid characters
}


// Get Selected Character Set Size
function getSelectedCharSetSize() {
    let size = 0;
    Object.keys(checkboxes).forEach((key) => {
        if (checkboxes[key].checked) {
            size += characterSets[key].length;
        }
    });
    return size;
}

// Format Time for Display
function formatTime(seconds) {
    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hours`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(2)} days`;
    return `${(seconds / 31536000).toFixed(2)} years`;
}



async function fetchAlgorithmsAndCPUs() {
    try {
        // Send GET request to the API
        const response = await fetch('http://192.168.248.66:5000/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Parse the response
        const data = await response.json();
        console.log(data);
        // Extract algorithms and CPU names from the response
        const algorithms = data.algorithms;
        const serverResponse = data.cpu_names;
    

         let cpuNames = serverResponse.reduce((acc, obj) => {
            const [id, name] = Object.entries(obj)[0];
            acc[id] = name;
            return acc;
        }, {});
        console.log(cpuNames)
        // Populate the CPU dropdown
        const cpuTypeSelect = document.getElementById('cpuType');
        Object.entries(cpuNames).forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id; // Use the CPU ID as the value
            option.textContent = name; // Use the CPU name as the display text
            cpuTypeSelect.appendChild(option);
        });
        // Populate the checkboxes
        const algorithmsContainer = document.getElementById('algorithms-container');
        algorithms.forEach((algorithm) => {
            // Create a checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = algorithm; // Use the algorithm name as the id
            checkbox.name = 'algorithms'; // Group all checkboxes under the same name
            checkbox.value = algorithm;

            // Create a label for the checkbox
            const label = document.createElement('label');
            label.htmlFor = algorithm;
            label.textContent = algorithm;

            // Append the checkbox and label to the container
            algorithmsContainer.appendChild(checkbox);
            algorithmsContainer.appendChild(label);

            // Add a line break for better readability
            algorithmsContainer.appendChild(document.createElement('br'));
        });
        console.log('Algorithms and CPUs fetched successfully:', data);
    } catch (error) {
        console.error('Error fetching algorithms and CPUs:', error);
        alert('An error occurred while fetching algorithms and CPUs.');
    }
}


