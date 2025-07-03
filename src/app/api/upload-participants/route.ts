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
    const event_id = formData.get('eventId') as string;
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }
    if (!event_id) {
      return new NextResponse('No event_id provided', { status: 400 });
    }

    // 2. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 4. Get customer_id from events table
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('customer_id')
      .eq('id', event_id)
      .single();
    if (eventError || !eventData) {
      return new NextResponse('Event not found or error fetching event', { status: 404 });
    }
    const customer_id = eventData.customer_id;

    // 5. Extract name, phone, email, and add customer_id and event_id
    const registrations = jsonData.map((row: any) => ({
      name: row.name,
      phone: row.phone,
      email: row.email,
      customer_id,
      event_id,
    }));

    // Insert into Supabase (adjust table/column names as needed)
    const { error } = await supabase.from('registrations').insert(registrations);
    if (error) {
      return new NextResponse('Database insert error', { status: 500 });
    }

    return NextResponse.json({ success: true, count: registrations.length });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
