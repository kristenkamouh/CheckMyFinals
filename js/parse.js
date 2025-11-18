/* ========================================
   FILE PARSING MODULE
   Handles CSV and Excel file parsing
   ======================================== */

/**
 * Clean and normalize strings for comparison
 */
const cleanString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().toUpperCase(); 
}

/**
 * Parse uploaded file (CSV or Excel)
 */
function parseFile(file, onSuccess, onError) {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        parseExcelFile(file, onSuccess, onError);
    } else if (fileName.endsWith('.csv')) {
        parseCSVFile(file, onSuccess, onError);
    } else {
        onError('Unsupported file format. Please upload .xlsx or .csv');
    }
}

/**
 * Parse Excel files using SheetJS
 */
function parseExcelFile(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            onSuccess(rawData);
        } catch (error) {
            console.error(error);
            onError(`Error parsing file: ${error.message}`);
        }
    };
    reader.readAsArrayBuffer(file);
}

/**
 * Parse CSV files
 */
function parseCSVFile(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split('\n');
            const rawData = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
            onSuccess(rawData);
        } catch (error) {
            console.error(error);
            onError(`Error parsing file: ${error.message}`);
        }
    };
    reader.readAsText(file);
}

/**
 * Extract exam data from parsed spreadsheet
 */
function extractExamData(rawData) {
    const processedData = [];
    let currentExamDate = '';
    let currentExamTime = '';
    
    // Simple heuristic to find start of data
    let dataStart = 0;
    for (let i = 0; i < Math.min(20, rawData.length); i++) {
        const rowText = (rawData[i] || []).join(' ').toUpperCase();
        if (rowText.includes('COURSE') || rowText.includes('TIME')) {
            dataStart = i + 1;
            break;
        }
    }

    console.log('=== PARSING DEBUG ===');
    console.log('Data starts at row:', dataStart);

    for (let i = dataStart; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 2) continue;

        // Log first 5 rows to see all data
        if (i - dataStart < 5) {
            console.log(`Row ${i}:`, row);
        }

        const firstCell = cleanString(row[0] || '');

        // Detect Date row FIRST
        if (firstCell.match(/(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|DECEMBER|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER)/i)) {
            currentExamDate = String(row[0]).trim().replace(/"/g, '');
            currentExamTime = '';
            console.log('Found date header:', currentExamDate);
            continue;
        }

        // Course code is ALWAYS in column 1 (index 1)
        const courseCodePattern = /^[A-Z]{2,4}\s*\d{3}/;
        const col1 = String(row[1] || '').trim();
        
        if (courseCodePattern.test(cleanString(col1))) {
            // This is a course row
            // Time may be in column 0, or empty (from merged cells in Excel)
            let timeValue = String(row[0] || '').trim();

            // If this row has a time value, remember it for subsequent rows
            if (timeValue) {
                currentExamTime = timeValue;
            } else {
                // If the cell is empty (due to merged cells), reuse the last seen time for this date
                timeValue = currentExamTime;
            }
            
            const courseData = {
                examDate: currentExamDate,
                time: timeValue,  // Column 0 - may be empty for merged cells
                courseCode: col1,  // Column 1
                section: String(row[2] || '').trim(),  // Column 2
                title: String(row[3] || '').trim(),  // Column 3
                instructor: String(row[5] || '').trim(),  // Column 5
                room: String(row[6] || '').trim(),  // Column 6
                searchableCode: cleanString(col1).replace(/\s+/g, '')
            };
            
            processedData.push(courseData);
        }
    }
    
    console.log('Total parsed exam entries:', processedData.length);
    console.log('Sample entry:', processedData[0]);
    return processedData;
}
