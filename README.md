# Import to CiviCRM from Twingle-csv

A small script that allows Twingle users to import data from the csv file Twingle provides. It generates API-calls to your CiviCRM as it was coming from Twingle directly. This is a great way of importing existing data when starting to use CiviCRM after using Twingle for a while already.

## Limitations
- This script was developed for the needs or our own organisation, your requirements might differ. Please check the code if this does what you need or run in debug-mode to review the raw API-Calls.
- If something is configured wrong this script might not work without really telling you why. I did not spend the time to catch errors and return useful information as to what went wrong.
- Empty lines will not be skipped but simply result in Civi returning an error message. These can be ignored. 
- This script runs the csv-rows from last (oldes entry) to first (newest entry) and with all csv files that I tested it will process one empty row first, before starting with the last row that actually contains data.

## Prerequisites
- You have node.js installed or know otherwise to to execute the script.
- You have installed and configured the Twingle-API Extension in your CiviCRM https://github.com/systopia/de.systopia.twingle/
- You are familiar with the Twingle-API documentation https://docs.civicrm.org/twingle/en/latest/
- You have a csv-file that follows the Twingle-csv layout, with desprictors in the first row, seperators being ";" and formatted in UTF-8. Please do not use Excel to modify the csv (trust me) unless you are really know what you're doing. My suggestion is to use LibreOffice instead.

## Installation
- Clone or manually download this repo to your computer.
- Configure the config.js
- run the script with node from your terminal or through other means
```
node import.js
```
