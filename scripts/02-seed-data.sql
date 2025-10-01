-- Seed sample employees
INSERT INTO employees (first_name, last_name, email, department, position, hire_date, status)
VALUES
  ('Sarah', 'Johnson', 'sarah.johnson@company.com', 'Engineering', 'Senior Developer', '2022-03-15', 'active'),
  ('Michael', 'Chen', 'michael.chen@company.com', 'Human Resources', 'HR Manager', '2021-06-01', 'active'),
  ('Emily', 'Rodriguez', 'emily.rodriguez@company.com', 'Marketing', 'Marketing Specialist', '2023-01-10', 'active'),
  ('David', 'Thompson', 'david.thompson@company.com', 'Engineering', 'DevOps Engineer', '2022-09-20', 'active'),
  ('Jessica', 'Williams', 'jessica.williams@company.com', 'Sales', 'Sales Representative', '2023-04-05', 'active')
ON CONFLICT (email) DO NOTHING;

-- Seed sample accommodations
INSERT INTO accommodations (employee_id, title, description, accommodation_type, status, start_date, approved_by, approved_at)
SELECT 
  e.id,
  'Ergonomic Workstation Setup',
  'Height-adjustable desk, ergonomic chair, and monitor arm for improved posture and reduced strain',
  'Equipment',
  'active',
  '2023-06-01',
  'Michael Chen',
  '2023-05-25 10:30:00'
FROM employees e
WHERE e.email = 'sarah.johnson@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO accommodations (employee_id, title, description, accommodation_type, status, start_date, approved_by, approved_at)
SELECT 
  e.id,
  'Flexible Work Schedule',
  'Modified work hours to accommodate medical appointments and therapy sessions',
  'Schedule',
  'active',
  '2023-07-15',
  'Michael Chen',
  '2023-07-10 14:20:00'
FROM employees e
WHERE e.email = 'david.thompson@company.com'
ON CONFLICT DO NOTHING;

-- Seed sample accommodation requests
INSERT INTO accommodation_requests (employee_id, title, description, accommodation_type, urgency, status, requested_start_date)
SELECT 
  e.id,
  'Screen Reader Software',
  'Request for JAWS screen reader software to improve accessibility for visual impairment',
  'Software',
  'high',
  'pending',
  '2024-02-01'
FROM employees e
WHERE e.email = 'emily.rodriguez@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO accommodation_requests (employee_id, title, description, accommodation_type, urgency, status, requested_start_date, reviewed_by, reviewed_at, review_notes)
SELECT 
  e.id,
  'Noise-Canceling Headphones',
  'Request for noise-canceling headphones to reduce sensory overload in open office environment',
  'Equipment',
  'normal',
  'approved',
  '2024-01-15',
  'Michael Chen',
  '2024-01-12 09:45:00',
  'Approved. Equipment will be ordered and delivered within 2 weeks.'
FROM employees e
WHERE e.email = 'jessica.williams@company.com'
ON CONFLICT DO NOTHING;

-- Seed sample compliance records
INSERT INTO compliance_records (employee_id, record_type, title, description, compliance_date, expiry_date, status, created_by)
SELECT 
  e.id,
  'Medical Documentation',
  'ADA Accommodation Documentation',
  'Medical documentation supporting accommodation request',
  '2023-05-20',
  '2024-05-20',
  'current',
  'Michael Chen'
FROM employees e
WHERE e.email = 'sarah.johnson@company.com'
ON CONFLICT DO NOTHING;

INSERT INTO compliance_records (employee_id, record_type, title, description, compliance_date, expiry_date, status, created_by)
SELECT 
  e.id,
  'Training Completion',
  'Disability Awareness Training',
  'Completed mandatory disability awareness and inclusion training',
  '2023-08-15',
  NULL,
  'current',
  'System'
FROM employees e
WHERE e.email IN ('sarah.johnson@company.com', 'michael.chen@company.com', 'emily.rodriguez@company.com')
ON CONFLICT DO NOTHING;
