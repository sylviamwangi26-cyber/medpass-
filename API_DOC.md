# MEDPASS API Documentation

This document outlines the available API endpoints for the MEDPASS system.

## Authentication

### Register User
`POST /auth/register`

**Payload (Person):**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "patient", 
  "medpass_plan": "Basic", 
  "dob": "1990-01-01",
  "gender": "Male"
}
// Role can be: patient, nurse, doctor, lab, accounts, medpassadmin
```

**Payload (Hospital):**
```json
{
  "full_name": "City General Hospital",
  "email": "admin@cityhospital.com",
  "password": "hospitalpass",
  "role": "hospital"
}
```

**Response (Success 201):**
```json
{
  "message": "User registered successfully",
  "unique_id": "MP-PAT-XXXXXX",
  "user_id": 1
}
```

### Login
`POST /auth/login`

**Payload:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Success 200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "unique_id": "MP-PAT-XXXXXX",
    "full_name": "John Doe",
    "role": "patient"
  }
}
```

## Medical Modules

### Triage / Vitals
`POST /triage/add`
`GET /triage/patient/:patient_id`

### Laboratory
`GET /labs/all`
`POST /labs/update-status`

### Pharmacy
`GET /pharmacy/prescriptions`
`POST /pharmacy/dispense`

## Insurance & Billing

### MedPass Insurance Status
`GET /insurance/status/:user_id`

### Billing / Invoices
`GET /billing/patient/:patient_id`
`POST /billing/create`

---
*Note: Ensure all requests include the correct `Content-Type: application/json` header.*
