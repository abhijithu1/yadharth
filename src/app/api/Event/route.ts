import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/utils/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { 
      email,  // Email to find customer ID
      customer_name,
      event_name, 
      org_name, 
      start_date, 
      end_date, 
      type_of_event,
      theme_option  // Add theme_option field
    } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    if (!event_name) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 });
    }
    
    if (!org_name) {
      return NextResponse.json({ error: "org_name name is required" }, { status: 400 });
    }
    
    if (!start_date) {
      return NextResponse.json({ error: "Start date is required" }, { status: 400 });
    }
    
    if (!end_date) {
      return NextResponse.json({ error: "End date is required" }, { status: 400 });
    }
    
    if (!type_of_event) {
      return NextResponse.json({ error: "Event type is required" }, { status: 400 });
    }
    
    if (!theme_option) {
      return NextResponse.json({ error: "Certificate theme is required" }, { status: 400 });
    }
    
    // Validate theme option
    const validThemes = ["classic", "modern", "corporate"];
    if (!validThemes.includes(theme_option)) {
      return NextResponse.json({ 
        error: "Invalid theme option. Must be one of: classic, modern, corporate" 
      }, { status: 400 });
    }
    
    // Find customer by email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();
    
    let customer_id: string;
    
    if (customerError || !customer) {
      // If not found, create a new customer
      const { data: newCustomer, error: createCustomerError } = await supabase
        .from('customers')
        .insert([{ email, customer_name: customer_name || "New User" }])
        .select('id')
        .single();

      if (createCustomerError || !newCustomer) {
        console.error("Error creating customer:", createCustomerError);
        return NextResponse.json({ 
          error: "Failed to create customer record." 
        }, { status: 500 });
      }

      customer_id = newCustomer.id;
    } else {
      customer_id = customer.id;
    }
    
    // Create the event with theme_option
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .insert([
        { 
          customer_id,
          event_name,
          org_name,
          start_date,
          end_date,
          type_of_event,
          theme_option  // Include theme_option in the database insert
        }
      ])
      .select()
      .single();
    
    if (eventError) {
      console.error("Error creating event:", eventError);
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Event created successfully",
      event: newEvent,
      customer_id: customer_id
    });
    
  } catch (error) {
    console.error("Error processing event creation request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all events for a specific customer (by email)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Find customer by email first
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();
    
    if (customerError || !customer) {
      console.error("Error finding customer:", customerError);
      return NextResponse.json({ 
        error: "No customer found with this email" 
      }, { status: 404 });
    }
    
    // Now get all events for this customer
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('customer_id', customer.id);
    
    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      events,
      customer_id: customer.id
    });
    
  } catch (error) {
    console.error("Error processing event fetch request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get a specific event by ID
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      id, 
      event_name, 
      org_name, 
      start_date, 
      end_date, 
      type_of_event,
      theme_option  // Add theme_option for updates
    } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }
    
    // Construct update object with only provided fields
    const updateData: Record<string, any> = {};
    if (event_name !== undefined) updateData.event_name = event_name;
    if (org_name !== undefined) updateData.org_name = org_name;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (type_of_event !== undefined) updateData.type_of_event = type_of_event;
    if (theme_option !== undefined) {
      // Validate theme option if provided
      const validThemes = ["classic", "modern", "corporate"];
      if (!validThemes.includes(theme_option)) {
        return NextResponse.json({ 
          error: "Invalid theme option. Must be one of: classic, modern, corporate" 
        }, { status: 400 });
      }
      updateData.theme_option = theme_option;
    }
    
    // Only proceed if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        error: "No update data provided" 
      }, { status: 400 });
    }
    
    // Update the event
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating event:", error);
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Event updated successfully",
      event: updatedEvent
    });
    
  } catch (error) {
    console.error("Error processing event update request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}