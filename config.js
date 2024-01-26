const config = {
    url: 'https://my.website.com', // Host-Adress of your Civi-Site. For example https://my.website.com
    apiEndpoint: '/api/endpoint', // API-Endpoint of your Civi-CRM. eg. /wp-json/civicrm/v3/rest in WordPress. Check with your installation; even your WordPress path might differ.
    apiKey: 'your_secret_api_key', // API Key of the Civi-User used to import the Data. Refer to twingle Documentation for further Information.
    siteKey: 'your_secret_site_key', // Site Key for your CiviCRM. Refer to twingle Documentation for further Information.
    debugMode: true, // True will only fill a logfile with the raw API-Calls. Set to false when you want to make actual API calls
    csvFilePath: 'path/to/twingle-data.csv', // CSV-File to import from.
    logFilePath: 'path/to/logfile.txt', // Specify the log file path
    projectLookupTable: { // Lookup table to match the project_id from the csv to the project_id for civi in twinglemanager
      '1234': 'tw123abc4567890', // eg. porject_id for Twingle-from 'General donation'
      // Add more mappings as needed
    }
};
  
module.exports = config;  