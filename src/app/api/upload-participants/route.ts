import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Helper function to convert a string to URL-friendly slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

// Helper function to sanitize filename for cross-platform compatibility
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_')         // Replace spaces with underscores
    .trim();
}

// Helper function to fetch QR code as PNG buffer
async function fetchQRCodePNG(url: string): Promise<ArrayBuffer> {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(url)}`;
  const response = await fetch(qrApiUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch QR code: ${response.statusText}`);
  }
  
  return await response.arrayBuffer();
}

export async function POST(req: NextRequest) {
  try {
    console.log("API endpoint hit: /api/upload-participants");
    
    // 1. Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const event_id = formData.get('eventId') as string;
    
    console.log("Received formData:", { 
      hasFile: !!file, 
      eventId: event_id
    });
    
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
    
    console.log(`Parsed ${jsonData.length} participants from Excel file`);

    // 4. Get customer_id and event name from events table
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('customer_id, event_name')
      .eq('id', event_id)
      .single();
      
    if (eventError) {
      console.error("Error fetching event:", eventError);
      return new NextResponse(`Event fetch error: ${eventError.message}`, { status: 404 });
    }
    
    if (!eventData) {
      return new NextResponse('Event not found', { status: 404 });
    }
    
    const customer_id = eventData.customer_id;
    const eventName = eventData.event_name;
    const eventSlug = slugify(eventName);
    
    console.log("Event data retrieved:", { customer_id, eventName, eventSlug });

    // 5. Insert participants to get their IDs
    const { data: insertedParticipants, error } = await supabase
      .from('registrations')
      .insert(jsonData.map((row: any) => ({
        name: row.name,
        phone: row.phone,
        email: row.email,
        customer_id,
        event_id,
      })))
      .select();

    if (error) {
      console.error("Error inserting participants:", error);
      return new NextResponse(`Database insert error: ${error.message}`, { status: 500 });
    }

    if (!insertedParticipants || insertedParticipants.length === 0) {
      return new NextResponse('Failed to retrieve inserted participants', { status: 500 });
    }
    
    console.log(`Successfully inserted ${insertedParticipants.length} participants`);

    // 6. Generate verification URLs
    // Use environment variable or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const participantUrls = [];
    
    // Prepare data for updating the database
    const updatePromises = [];
    for (const participant of insertedParticipants) {
      const verificationUrl = `${baseUrl}/verify/${customer_id}/${eventSlug}/${participant.id}`;
      
      participantUrls.push({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        verification_url: verificationUrl
      });
      
      // Queue update for this participant to save the URL
      // Note: Make sure your registrations table has a verification_url column
      updatePromises.push(
        supabase
          .from('registrations')
          .update({ verification_url: verificationUrl })
          .eq('id', participant.id)
      );
    }

    // Update all participants with their verification URLs
    try {
      await Promise.all(updatePromises);
      console.log("Updated all participants with verification URLs");
    } catch (updateError) {
      console.warn("Warning: Could not update verification URLs:", updateError);
      // Continue with QR code generation even if URL update fails
    }

    // 7. Create ZIP file with QR code PNG files
    const zip = new JSZip();
    
    // Generate QR codes and add to ZIP
    console.log("Generating QR code PNG files...");
    
    const qrCodePromises = participantUrls.map(async (participant) => {
      try {
        // Fetch QR code as PNG
        const qrCodeBuffer = await fetchQRCodePNG(participant.verification_url);
        
        // Create sanitized filename
        const sanitizedName = sanitizeFilename(participant.name);
        const filename = `${sanitizedName}_${participant.id}.png`;
        
        // Add to ZIP
        zip.file(filename, qrCodeBuffer);
        
        console.log(`Generated QR code for: ${participant.name} -> ${filename}`);
        
        return { success: true, name: participant.name, filename };
      } catch (error) {
        console.error(`Failed to generate QR code for ${participant.name}:`, error);
        return { success: false, name: participant.name, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
    
    // Wait for all QR codes to be generated
    const qrResults = await Promise.all(qrCodePromises);
    
    // Log results
    const successful = qrResults.filter(r => r.success).length;
    const failed = qrResults.filter(r => !r.success).length;
    
    console.log(`QR Code generation complete: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      const failedNames = qrResults.filter(r => !r.success).map(r => r.name);
      console.warn("Failed QR codes for:", failedNames);
    }
    
    // Generate ZIP file as ArrayBuffer
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
    console.log("Generated ZIP file with QR code PNG files");

    // 8. Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${eventSlug}-qr-codes.zip"`,
        'Content-Type': 'application/zip',
      },
    });
  } catch (err) {
    console.error("Error in upload-participants API:", err);
    return new NextResponse(`Internal server error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 500 });
  }
}