const getBaseUrl = () => {
  return ''; // Use relative paths for all API calls
};

if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const full_name = document.getElementById('full_name')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const role = document.getElementById('role')?.value;
    const phone = document.getElementById('phone')?.value;
    const special_key = document.getElementById('special_key')?.value;

    console.log("📝 Registration Attempt:", role);

    const payload = { full_name, email, phone, password, role, special_key };
    // ... (rest of payload logic)
    if (role === 'patient' || role === 'hospital') {
      payload.location = document.getElementById('location')?.value || '';
    }

    if (role === 'hospital') {
      payload.num_doctors = document.getElementById('num_doctors')?.value || 0;
      payload.num_nurses = document.getElementById('num_nurses')?.value || 0;
      payload.num_wards = document.getElementById('num_wards')?.value || 0;
      payload.has_maternity = document.getElementById('has_maternity')?.checked || false;
      payload.has_theatre = document.getElementById('has_theatre')?.checked || false;
      payload.has_radiology = document.getElementById('has_radiology')?.checked || false;
      payload.has_lab = document.getElementById('has_lab')?.checked || false;
      payload.has_pharmacy = document.getElementById('has_pharmacy')?.checked || false;
      payload.has_account = document.getElementById('has_account')?.checked || false;
    }

    if (role === 'patient') {
      payload.dob = document.getElementById('dob')?.value || '';
      payload.gender = document.getElementById('gender')?.value || '';
      payload.blood_group = document.getElementById('blood_group')?.value || '';
      payload.allergies = document.getElementById('allergies')?.value || '';
      payload.emergency_contact = document.getElementById('emergency_contact')?.value || '';
      payload.family_id = document.getElementById('family_id')?.value || '';
      payload.national_id = document.getElementById('national_id')?.value || '';
      payload.primary_hospital_id = document.getElementById('primary_hospital_id')?.value || '';
      payload.hospital_id = payload.primary_hospital_id;
      payload.preferred_doctor_name = document.getElementById('preferred_doctor_name')?.value || '';
    }


    try {
      const res = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log("📡 Registration Response Status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Registration Error Raw:", text);
        try {
          const errData = JSON.parse(text);
          alert(errData.error || "Registration failed");
        } catch (e) {
          alert(`Server Error: ${res.status} ${res.statusText}`);
        }
        return;
      }

      const data = await res.json();
      console.log("✅ Registration Success:", data);

      // CLEAR SUCCESS MESSAGE
      alert(`🎉 SUCCESSFULLY REGISTERED!\n\nWelcome to MedPass, ${full_name}.\nYou are now registered as: ${role.toUpperCase()}.\n\nPlease log in to access your dashboard.`);

      if (res.status === 201) window.location.href = 'login.html';
    } catch (error) {
      console.error("🚨 Network/Fetch Error:", error);
      alert("CRITICAL CONNECTION ERROR:\n\n1. Ensure 'node server.js' is running.\n2. You MUST use http://localhost:5000 (NOT Port 5502 or Live Server).\n3. Check if your browser console (F12) shows CORS errors.");
    }
  });
}

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('identifier')?.value;
    const password = document.getElementById('password')?.value;

    console.log("🔐 Login Attempt:", identifier);

    try {
      const res = await fetch(`/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      console.log("📡 Login Response Status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Login Error Raw:", text);
        try {
          const errData = JSON.parse(text);
          alert(errData.error || "Login failed");
        } catch (e) {
          alert(`Server Error: ${res.status} ${res.statusText}`);
        }
        return;
      }

      const data = await res.json();
      console.log("✅ Login Data Received:", data);

      if (res.status === 200) {
        if (data.needsPasswordReset) {
          const newPass = prompt("First time login! Please set your new private password:");
          if (!newPass) return alert("You must set a password to proceed.");

          const updateRes = await fetch(`/auth/update-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id, oldPassword: 'CHANGE_ME', newPassword: newPass })
          });

          if (!updateRes.ok) return alert("Failed to set password. Try again.");
          alert("Password set successfully! Please log in with your new password.");
          return;
        }

        // Store session
        localStorage.clear(); // Clear old trash
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('username', data.user.full_name);

        console.log("💼 Session stored. Redirecting for role:", data.user.role);

        // CLEAR SUCCESS MESSAGE
        alert(`🔓 SUCCESSFULLY LOGGED IN!\n\nRole: ${data.user.role.toUpperCase()}\nStatus: Online`);

        // Success Animation
        if (typeof showSuccessAnimation === 'function') {
          showSuccessAnimation();
          setTimeout(() => {
            redirectUser(data.user.role);
          }, 3000);
        } else {
          redirectUser(data.user.role);
        }
      }
    } catch (error) {
      console.error("🚨 Network/Fetch Error:", error);
      alert("CRITICAL CONNECTION ERROR:\n\n1. Ensure 'node server.js' is running.\n2. You MUST use http://localhost:5000 (NOT Port 5502 or Live Server).\n3. Check if your browser console (F12) shows CORS errors.");
    }
  });
}

function redirectUser(role) {
  let target = 'patient.html';
  if (role === 'doctor' || role === 'nurse') target = 'medicalpractioner.html';
  else if (role === 'lab') target = 'dashboardlab.html';
  else if (role === 'accounts') target = 'dashboardaccount.html';
  else if (role === 'receptionist') target = 'dashboardreceptionist.html';
  else if (role === 'hospital') target = 'dashboardhospital.html';
  else if (role === 'medpassadmin' || role === 'admin') target = 'dashboardadmin.html';
  else if (role === 'pharmacy') target = 'dashboardpharmacy.html';

  window.location.href = target;
}
