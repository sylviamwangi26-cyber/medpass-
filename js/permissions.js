function protectPage(allowedRoles) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        // Not logged in, send to login page
        window.location.href = "login.html";
        return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Wrong role, deny access
        alert("Access denied for role: " + user.role);
        window.location.href = "login.html";
    }
}
