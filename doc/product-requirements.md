# Product Requirements Document (PRD)

## Project Title: Certificate Verification Platform

---

## 1. Overview

The Certificate Verification Platform is a web-based solution designed to streamline the process of issuing, distributing, and verifying event participation certificates. The platform enables event organizers to upload participant data via Excel, automatically generate unique certificate URLs and QR codes for each participant, and provide a public verification page for certificate validation.

---

## 2. Goals & Objectives

- **Automate certificate generation** for event participants.
- **Enable easy verification** of certificates via QR codes and unique URLs.
- **Provide a secure, authenticated portal** for event organizers using Clerk authentication.
- **Support bulk participant data upload** via Excel.
- **Deliver a seamless experience** for both organizers and certificate recipients.

---

## 3. User Roles

### 3.1. Customer (Event Organizer)
- Registers and logs in via Clerk authentication.
- Creates and manages events.
- Uploads participant data.
- Views and manages generated certificates.

### 3.2. Participant (Certificate Recipient)
- Receives a certificate link/QR code.
- Can verify their certificate status via a public webpage.

---

## 4. Functional Requirements

### 4.1. Authentication & User Management

- Use Clerk for user authentication.
- Store customer details in a `customers` table:
  - Name
  - Email (from Clerk)
- Only authenticated users can create/manage events and upload data.

### 4.2. Event Management

- Authenticated customers can create new events by providing:
  - Event Name
  - Organization Name
  - Start Date
  - End Date
  - Type of Event
- Each event is associated with the customer who created it.

### 4.3. Participant Data Upload

- After event creation, customers are prompted to upload an Excel sheet.
- Excel sheet must contain the following columns:
  - Participant Name
  - Email
  - Phone
- System validates the Excel format and required columns.

### 4.4. Certificate Generation

- For each participant:
  - Generate a unique URL for certificate verification.
  - Generate a QR code pointing to the unique URL.
- Store certificate data in a `certificates` table:
  - Participant Name
  - Email
  - Phone
  - Event ID
  - Certificate URL
  - QR Code (image or data)
  - Status (e.g., "Issued", "Revoked")

### 4.5. Certificate Verification Page

- Publicly accessible page for each certificate.
- Displays:
  - "{Name} successfully completed {event name} organised by {organiser name} from {start date} to {end date}."
  - Certificate status (valid/revoked).
- Optionally, display event and participant details.

### 4.6. Admin/Customer Dashboard

- View list of created events.
- View and manage participants for each event.
- Download participant/certificate data.
- Option to revoke certificates.

---

## 5. Non-Functional Requirements

- **Security:** All sensitive operations require authentication. Public certificate pages expose only necessary information.
- **Scalability:** System should handle large Excel uploads (e.g., 1000+ participants).
- **Reliability:** Ensure QR codes and URLs are unique and persistent.
- **Usability:** Simple, intuitive UI for both organizers and participants.
- **Performance:** Certificate generation and QR code creation should be fast.

---

## 6. Data Model (High-Level)

### 6.1. Customers Table

| Field      | Type   | Description                |
|------------|--------|---------------------------|
| id         | UUID   | Primary Key               |
| name       | String | Customer Name             |
| email      | String | Clerk Auth Email          |

### 6.2. Events Table

| Field           | Type   | Description                |
|-----------------|--------|---------------------------|
| id              | UUID   | Primary Key               |
| customer_id     | UUID   | Foreign Key (Customer)    |
| event_name      | String | Name of the Event         |
| organisation    | String | Organisation Name         |
| start_date      | Date   | Event Start Date          |
| end_date        | Date   | Event End Date            |
| event_type      | String | Type of Event             |

### 6.3. Certificates Table

| Field           | Type   | Description                |
|-----------------|--------|---------------------------|
| id              | UUID   | Primary Key               |
| event_id        | UUID   | Foreign Key (Event)       |
| participant_name| String | Name of Participant       |
| email           | String | Participant Email         |
| phone           | String | Participant Phone         |
| certificate_url | String | Unique URL                |
| qr_code         | String | QR Code (image/data)      |
| status          | String | Issued/Revoked            |

---

## 7. User Flows

### 7.1. Organizer Flow

1. Sign up / Log in via Clerk.
2. Create a new event (enter event details).
3. Upload Excel sheet with participant data.
4. System processes data, generates certificates, and displays summary.
5. Download/share certificate URLs or QR codes.

### 7.2. Participant Flow

1. Receives certificate link or scans QR code.
2. Visits verification page.
3. Sees certificate status and event details.

---

## 8. Technical Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js API routes or serverless functions
- **Database:** (e.g., PostgreSQL, Supabase, or similar)
- **Authentication:** Clerk
- **QR Code Generation:** (e.g., `qrcode` npm package)
- **Excel Parsing:** (e.g., `xlsx` npm package)

---

## 9. Future Enhancements

- Email certificate links directly to participants.
- Support for certificate PDF downloads.
- Analytics dashboard for organizers.
- Customizable certificate templates.
- API for third-party integrations.

---

## 10. Open Questions

- Should certificate pages be indexed by search engines?
- Should there be a public directory of all events/certificates?
- What level of branding/customization is required for certificates? 