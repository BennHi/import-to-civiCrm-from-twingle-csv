const fs = require('fs');
const axios = require('axios');
const config = require('./config'); // Enter your config-variables here

// Read the CSV file (assuming it's tab-separated)
const csv = fs.readFileSync(config.csvFilePath, 'utf8');
const rows = csv.split('\n').map(row => row.split(';'));

// Skip the header row (assuming it contains column names)
const header = rows[0];
rows.shift();

// Function to send API requests
async function sendApiRequest(row, rowIndex) {
    // Construct the URL
    const apiUrl = `${config.url}${config.apiEndpoint}?entity=TwingleDonation&action=submit&key=${encodeURIComponent(config.siteKey)}&api_key=${encodeURIComponent(config.apiKey)}&json=1`
      + appendIfNotEmpty('project_id', config.projectLookupTable[getValue(row, 'project_id')])
      + appendIfNotEmpty('trx_id', getValue(row, 'trx_id'))
      + appendIfNotEmpty('confirmed_at', convertTimestampFormat(getValue(row, 'timestamp')))
      + appendIfNotEmpty('purpose', getValue(row, 'purpose'))
      + appendIfNotEmpty('amount', convertAmountToCents(getValue(row, 'amount')))
      + appendIfNotEmpty('currency', getValue(row, 'currency'))
      + appendIfNotEmpty('user_email', getValue(row, 'user_email'))
      + appendIfNotEmpty('user_country', getValue(row, 'user_country'))
      + '&user_language=de'
      + appendIfNotEmpty('payment_method', getValue(row, 'payment_method'))
      + appendIfNotEmpty('donation_rhythm', getValue(row, 'donation_rhythm'))
      + appendIfNotEmpty('debit_iban', getValue(row, 'debit_iban'))
      + appendIfNotEmpty('debit_bic', getValue(row, 'debit_bic'))
      + appendIfNotEmpty('debit_mandate_reference', getValue(row, 'debit_sepa_mandate'))
      + appendIfNotEmpty('debit_account_holder', getValue(row, 'debit_account_holder'))
      + '&is_anonymous=0'
      + appendIfNotEmpty('newsletter', getValue(row, 'newsletter'))
      + appendIfNotEmpty('postinfo', getValue(row, 'postinfo'))
      + appendIfNotEmpty('donation_receipt', getValue(row, 'donation_receipt'))
      + appendIfNotEmpty('user_gender', getValue(row, 'user_gender'))
      + appendIfNotEmpty('user_firstname', getValue(row, 'user_firstname'))
      + appendIfNotEmpty('user_lastname', getValue(row, 'user_lastname'))
      + appendIfNotEmpty('user_street', getValue(row, 'user_street'))
      + appendIfNotEmpty('user_postal_code', getValue(row, 'user_postal_code'))
      + appendIfNotEmpty('user_city', getValue(row, 'user_city'))
      + appendIfNotEmpty('user_telephone', getValue(row, 'user_telephone'))
      // Commented out the custom_fields line
      // + appendIfNotEmpty('custom_fields', getValue(row, 'custom_fields'))
      + appendIfNotEmpty('parent_trx_id', getValue(row, 'parent_trx_id'))
      + appendIfNotEmpty('user_title', getValue(row, 'user_title'))
      + appendIfNotEmpty('user_birthdate', convertDateFormat(getValue(row, 'user_birthday')))
      + appendIfNotEmpty('user_company', getValue(row, 'user_company'))
      + appendIfNotEmpty('user_extrafield', getValue(row, 'user_extrafield'))
      + appendIfNotEmpty('campaign_id', getValue(row, 'campaign'));  
  
    let logEntry = `Row ${rowIndex + 2}: `; // Adding 1 to rowIndex to start with 1-based index
    if (config.debugMode) {
        console.log('Debug Mode - URL:', apiUrl.replace(`&key=${encodeURIComponent(config.siteKey)}&api_key=${encodeURIComponent(config.apiKey)}`, '&key=*****&api_key=*****'));

        const maskedUrl = apiUrl.replace(`${encodeURIComponent(config.siteKey)}&api_key=${encodeURIComponent(config.apiKey)}`, '&key=*****&api_key=*****');
        logEntry += `Debug Mode - URL: ${maskedUrl}`;
    } else {
        // Make the API call
        try {
            const response = await axios.post(apiUrl);
            console.log('API Response:', response.data);
            logEntry += `API Response: ${JSON.stringify(response.data)}`;
        } catch (error) {
            logEntry += `API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`;
            console.error('API Error:', error.response ? error.response.data : error.message);
        }
    }
    // Write log entry to the file
    fs.appendFileSync(config.logFilePath, logEntry + '\n', 'utf8');
}

// Function to append parameter if value is not empty
function appendIfNotEmpty(parameter, value) {
    return value ? `&${parameter}=${encodeURIComponent(value)}` : '';
}

// Function to convert date format (for birthday)
function convertDateFormat(dateString) {
    if (!dateString) {
      return '';
    }
  
    const [day, month, year] = dateString.split('.');
    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
}

// Function to convert timestamp format
function convertTimestampFormat(timestampString) {
    if (!timestampString) {
      return '';
    }
  
    const [date, time] = timestampString.split(' ');
  
    // Assuming date is in the format DD.MM.YYYY
    const [day, month, year] = date.split('.');
    const formattedDate = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
  
    // Handling time parts
    const [hour, minute, second] = time ? time.split(':') : ['00', '00', '00'];
  
    return `${formattedDate}${hour.padStart(2, '0')}${minute.padStart(2, '0')}${second.padStart(2, '0')}`;
}  

// Function to convert amount to cents
function convertAmountToCents(amount) {
    if (!amount) {
      return '';
    }
  
    // Assuming amount is in euros
    const amountInCents = parseInt(amount) * 100;
    return amountInCents.toString();
}

// Function to get the value from the row, handling empty cells
function getValue(row, columnName) {
const columnIndex = header.indexOf(columnName);
const value = columnIndex !== -1 ? row[columnIndex] : '';
return value !== undefined && value !== null && value !== '' ? value : '';
}
  
// Loop through each row in reverse order and send API requests sequencially
// for (let i = rows.length - 1; i >= 0; i--) {
//     sendApiRequest(rows[i]);
// }

// Function to send API requests sequentially
async function sendApiRequestsSequentially(rows) {
    for (let i = rows.length - 1; i >= 0; i--) {
        await sendApiRequest(rows[i], i);
    }
}
  
// Call the function to send API requests sequentially
sendApiRequestsSequentially(rows);