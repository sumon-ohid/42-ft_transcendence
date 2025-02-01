function userDashboard() {
    saveCurrentPage('userDashboard');

    if (!userIsLoggedIn()) {
        navigateTo('#login');
        return;
    }

    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <h2>Dashboard</h2>
        <div class="quit-game" onclick="navigateTo('#homePage')">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}
