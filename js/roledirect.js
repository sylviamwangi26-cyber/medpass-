function redirectToDashboard(role) {
    console.log("Redirecting for role:", role);
    switch (role) {
        case "hospital-admin": // Matches login.html and register.html options if applicable
        case "admin":
            window.location.href = "dashboardadmin.html";
            break;
        case "doctor":
        case "nurse":
            window.location.href = "medicalpractioner.html";
            break;
        case "accounts":
            window.location.href = "dashboardaccount.html";
            break;
        case "lab":
            window.location.href = "dashboardlab.html";
            break;
        case "patient":
            window.location.href = "patient.html";
            break;
        case "receptionist":
            window.location.href = "dashboardreceptionist.html";
            break;
        case "hospital":
            window.location.href = "dashboardhospital.html";
            break;
        case "pharmacy":
            window.location.href = "dashboardpharmacy.html";
            break;
        case "medpassadmin":
        case "admin":
            window.location.href = "dashboardadmin.html";
            break;
        default:
            console.error("Unknown role:", role);
            alert("Invalid role: " + role);
    }
}
