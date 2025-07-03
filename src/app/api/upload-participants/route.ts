import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    // 2. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 4. Extract name and phone, and insert into Supabase
    const participants = jsonData.map((row: any) => ({
      name: row.name,
      phone: row.phone,
    }));

    // Insert into Supabase (adjust table/column names as needed)
    const { error } = await supabase.from('participants').insert(participants);
    if (error) {
      return new NextResponse('Database insert error', { status: 500 });
    }

    return NextResponse.json({ success: true, count: participants.length });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
