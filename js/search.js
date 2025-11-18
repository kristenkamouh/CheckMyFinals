/* ========================================
   SEARCH & DISPLAY MODULE
   Handles exam searching and result display
   ======================================== */

let examsData = [];

// DOM Elements
const UPLOAD_STATUS = document.getElementById('uploadStatus');
const FILE_TEXT = document.getElementById('fileText');
const SEARCH_SECTION = document.getElementById('search-section');
const RESULTS_SECTION = document.getElementById('results-section');
const RESULTS_MESSAGE = document.getElementById('results-message');
const RESULTS_TABLE = document.getElementById('resultsTable');
const RESULTS_BODY = document.getElementById('resultsBody');
const COURSE_INPUT = document.getElementById('courseCodeInput');

/**
 * Handle file input change event
 */
function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        FILE_TEXT.textContent = file.name;
        FILE_TEXT.style.fontWeight = 'bold';
        FILE_TEXT.style.color = '#4f46e5';
        
        setUploadStatus("Parsing file...", "status-loading");
        
        parseFile(file, 
            (rawData) => processData(rawData),
            (errorMsg) => setUploadStatus(errorMsg, 'status-error')
        );
    }
}

/**
 * Set upload status message
 */
function setUploadStatus(msg, className) {
    UPLOAD_STATUS.textContent = msg;
    UPLOAD_STATUS.className = className;
}

/**
 * Process parsed data and update UI
 */
function processData(rawData) {
    examsData = extractExamData(rawData);
    if (examsData.length > 0) {
        setUploadStatus(`Success! Loaded ${examsData.length} exam entries.`, 'status-success');
        SEARCH_SECTION.classList.remove('hidden');
        RESULTS_SECTION.classList.remove('hidden');
        COURSE_INPUT.focus();
        RESULTS_MESSAGE.textContent = "Enter a course code to start searching.";
        RESULTS_TABLE.classList.add('hidden');
        RESULTS_MESSAGE.classList.remove('hidden');
    } else {
        setUploadStatus("Error: No valid exam data found.", 'status-error');
    }
}

/**
 * Search for exams by course code
 */
function searchExams() {
    const rawQuery = COURSE_INPUT.value;
    if (!rawQuery) {
        displayResults([], 'Please enter a course code.');
        return;
    }

    const cleanedQuery = cleanString(rawQuery).replace(/\s+/g, '');
    const filteredResults = examsData.filter(exam => 
        exam.searchableCode.startsWith(cleanedQuery) || exam.searchableCode === cleanedQuery
    );
    
    if (filteredResults.length > 0) {
        displayResults(filteredResults);
    } else {
        displayResults([], `No exams found for "${rawQuery}".`);
    }
}

/**
 * Handle search on Enter key
 */
function handleSearch(event) {
    if (event.key === 'Enter') {
        searchExams();
    }
}

/**
 * Display search results in table
 */
function displayResults(results, message = '') {
    RESULTS_BODY.innerHTML = '';
    
    if (results.length === 0) {
        RESULTS_TABLE.classList.add('hidden');
        RESULTS_MESSAGE.classList.remove('hidden');
        RESULTS_MESSAGE.textContent = message;
        return;
    }
    
    RESULTS_MESSAGE.classList.add('hidden');
    RESULTS_TABLE.classList.remove('hidden');

    results.forEach(exam => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exam.examDate}</td>
            <td>${exam.time}</td>
            <td class="course-code">${exam.courseCode} <small style="color:#999">(${exam.section})</small></td>
            <td>${exam.title}</td>
            <td><span class="room-tag">${exam.room}</span></td>
            <td>${exam.instructor}</td>
        `;
        RESULTS_BODY.appendChild(row);
    });
}
