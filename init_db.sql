-- Database initialization for MEDPASS

CREATE DATABASE IF NOT EXISTS med_pass;
USE med_pass;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS billing, pharmacy_records, lab_records, visits, triage_vitals, med_practioners, patients, users, hospitals, ai_agent, medpass_insurance_plans;

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    num_doctors INT DEFAULT 0,
    num_nurses INT DEFAULT 0,
    num_wards INT DEFAULT 0,
    has_maternity BOOLEAN DEFAULT FALSE,
    has_theatre BOOLEAN DEFAULT FALSE,
    has_radiology BOOLEAN DEFAULT FALSE,
    has_lab BOOLEAN DEFAULT FALSE,
    has_pharmacy BOOLEAN DEFAULT FALSE,
    has_account BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (Centralized Auth)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'nurse', 'lab', 'accounts', 'patient', 'hospital', 'medpassadmin', 'receptionist', 'radiologist', 'pharmacy', 'admin') NOT NULL,
    hospital_id INT,
    language_preference VARCHAR(10) DEFAULT 'EN',
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients details
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT UNIQUE,
    family_id VARCHAR(50), -- Linking family members
    name VARCHAR(255) NOT NULL,
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allergies TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    emergency_contact VARCHAR(255),
    profile_picture VARCHAR(255),
    insurance_type VARCHAR(100),
    insurance_id VARCHAR(100),
    medpass_plan ENUM('None', 'Basic', 'Premium', 'VIP') DEFAULT 'None',
    medpass_credits INT DEFAULT 0,
    last_engagement TIMESTAMP NULL,
    national_id VARCHAR(50),
    primary_hospital_id INT,
    preferred_doctor_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Practitioners details
CREATE TABLE IF NOT EXISTS med_practioners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    hospital_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triage Vitals
CREATE TABLE IF NOT EXISTS triage_vitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT,
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    recorded_by INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- FOREIGN KEY (visit_id) REFERENCES visits(id)
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Visits / Consultations
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    practitioner_id INT,
    hospital_id INT NOT NULL,
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    referred_from_hospital_id INT,
    medications TEXT,
    test_results TEXT,
    xray_links TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (practitioner_id) REFERENCES med_practioners(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (referred_from_hospital_id) REFERENCES hospitals(id)
);

-- Lab Records
CREATE TABLE IF NOT EXISTS lab_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT,
    patient_id INT,
    test_name VARCHAR(255),
    results TEXT,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    lab_tech_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (lab_tech_id) REFERENCES users(id)
);

-- Pharmacy Records
CREATE TABLE IF NOT EXISTS pharmacy_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT,
    patient_id INT,
    medication_name VARCHAR(255),
    dosage VARCHAR(255),
    prescription_notes TEXT,
    status ENUM('Pending', 'Dispensed') DEFAULT 'Pending',
    pharmacist_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (pharmacist_id) REFERENCES users(id)
);

-- Billing
CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    visit_id INT,
    amount DECIMAL(10,2),
    description TEXT,
    billing_type ENUM('Insurance', 'Medpass', 'Cash') DEFAULT 'Cash',
    insurance_provider_id INT,
    status ENUM('Pending', 'Billed', 'Paid') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (visit_id) REFERENCES visits(id)
);

-- AI Agent Configuration & Knowledge
CREATE TABLE IF NOT EXISTS ai_agent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medpass Insurance Plans Knowledge Base
CREATE TABLE IF NOT EXISTS medpass_insurance_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name ENUM('Basic', 'Premium', 'VIP') NOT NULL,
    monthly_premium DECIMAL(10,2),
    benefits TEXT,
    privileges TEXT, -- Detailed privileges for the package
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data for AI Agent
INSERT INTO ai_agent (name, category, content) VALUES 
('Medication Reminder', 'Reminder', 'Don''t forget to take your prescribed medication on time for a speedy recovery.'),
('Daily Health Tip', 'Tip', 'Drinking at least 8 glasses of water a day helps maintain energy levels and skin health.'),
('Follow-up Reminder', 'Reminder', 'Scheduling regular check-ups is key to preventive healthcare.');

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    from_hospital_id INT,
    to_hospital_id INT,
    reason TEXT,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (from_hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (to_hospital_id) REFERENCES hospitals(id)
);

-- Imaging Records (X-Ray, MRI, Ultrasound, etc.)
CREATE TABLE IF NOT EXISTS imaging_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT,
    patient_id INT,
    imaging_type ENUM('X-Ray', 'MRI', 'Ultrasound', 'CT Scan', 'Other') NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    results TEXT,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    technician_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Awards & Achievements
CREATE TABLE IF NOT EXISTS awards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Central User ID
    hospital_id INT, -- Or Hospital ID
    award_name VARCHAR(100) NOT NULL,
    award_type ENUM('Badge', 'Milestone', 'Points') NOT NULL,
    award_value INT DEFAULT 0,
    description TEXT,
    icon VARCHAR(50), -- CSS class or emoji
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

-- Seed some Hospital Awards
INSERT INTO awards (hospital_id, award_name, award_type, description, icon) VALUES 
(1, 'Referral Center of Excellence', 'Badge', 'Processed over 50 referrals', '🏆'),
(2, 'Fast Diagnosis Gold', 'Badge', 'Avg lab turnaround under 2 hours', '⚡');

-- SMS Logs
CREATE TABLE IF NOT EXISTS sms_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS = 1;
