import { google } from 'googleapis';

const SHEET_HEADERS = [
  'Timestamp',
  'Name',
  'Phone',
  'Email',
  'NBFC/Lender',
  'Original Amount',
  'Outstanding Amount',
  'EMI Due Date',
  'DPD',
  'Last Payment Date',
  'Last Payment Amount',
  'Loan Type',
  'Room Name',
  'Call Status',
  'Recording URL',
  'Transcript URL',
  'Analysis URL'
];

async function ensureHeaders(sheets: any, spreadsheetId: string) {
  try {
    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:Z1',
    });

    const values = response.data.values;
    
    // If no values or headers don't match, add headers
    if (!values || values.length === 0 || values[0].length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:Q1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [SHEET_HEADERS],
        },
      });
      console.log('Headers added to sheet');
    }
  } catch (error) {
    console.error('Error ensuring headers:', error);
    // If sheet doesn't exist or error occurs, try to add headers anyway
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:Q1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [SHEET_HEADERS],
        },
      });
    } catch (headerError) {
      console.error('Error adding headers:', headerError);
    }
  }
}

export async function appendToSheet(data: any[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID environment variable is not set');
  }

  try {
    // Ensure headers exist
    await ensureHeaders(sheets, spreadsheetId);

    // Append data
    const range = 'Sheet1!A:Q';
    const values = [data];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    return response;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}