import { appendToSheet } from '@/lib/sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array.' },
        { status: 400 }
      );
    }

    const response = await appendToSheet(data);
    
    return NextResponse.json({
      success: true,
      message: 'Data successfully added to Google Sheets',
      response: response.data
    });
  } catch (error) {
    console.error('Error in sheets API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add data to Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}