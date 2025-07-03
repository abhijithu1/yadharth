import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return new NextResponse('Missing or invalid "text" in request body', { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const safeText = text.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 32);
    const filename = `${safeText}_${timestamp}.png`;
    const filePath = path.join(process.cwd(), 'public', 'generated-qrcodes', filename);
    const publicUrl = `/generated-qrcodes/${filename}`;

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(text, { type: 'png' });

    // Save the file
    await writeFile(filePath, qrBuffer);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('QR code generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 