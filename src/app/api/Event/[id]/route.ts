import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }

  return NextResponse.json({ message: "Event deleted successfully" });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.log("Received update request for event:", id, "with data:", body);

  // Only allow updating specific fields - ADDED theme_option
  const updatableFields = [
    "event_name",
    "org_name",
    "start_date",
    "end_date",
    "type_of_event",
    "theme_option"  // Added theme_option to updatable fields
  ];
  
  const updateData: Record<string, any> = {};
  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }
  
  // Add validation for theme_option
  if (updateData.theme_option !== undefined) {
    const validThemes = ["classic", "modern", "corporate","elegant","fun"];
    if (!validThemes.includes(updateData.theme_option)) {
      return NextResponse.json({ 
        error: "Invalid theme_option. Must be one of: classic, modern, corporate" 
      }, { status: 400 });
    }
  }
  
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  console.log("Updating event with data:", updateData);

  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }

  console.log("Event updated successfully:", data);
  return NextResponse.json({ message: "Event updated successfully", event: data });
}