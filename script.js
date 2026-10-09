let users = [];

let userGrid = document.getElementById("userGrid");
let searchInput = document.getElementById("searchInput");
let roleFilter = document.getElementById("roleFilter");
let statusFilter = document.getElementById("statusFilter");
let message = document.getElementById("message");
let emptyState = document.getElementById("emptyState");
let resultCount = document.getElementById("resultCount");

// Fetch data from JSON file
async function fetchUsers() {
    try {
        message.textContent = "Loading users...";

        let response = await fetch("https://fakestoreapi.noksha.dev/api/users");

        if (!response.ok) {
            throw new Error("Unable to fetch users");
        }

        let result = await response.json();

        users = result.data;

        // Dashboard statistics
        document.getElementById("totalUsers").textContent =
            users.length;

        document.getElementById("activeUsers").textContent =
            users.filter(user => user.status === "Active").length;

        document.getElementById("adminUsers").textContent =
            users.filter(user => user.role === "Admin").length;

        message.textContent = "";

        showUsers();

    } catch (error) {
        console.error(error);

        message.textContent =
            "Data load nahi hua. Live Server aur users.json check karo.";

        resultCount.textContent = "Error";
    }
}

// Show users on page
function showUsers() {
    let searchValue = searchInput.value.toLowerCase().trim();
    let selectedRole = roleFilter.value;
    let selectedStatus = statusFilter.value;

    let filteredUsers = users.filter(user => {
        let matchesSearch =
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.username.toLowerCase().includes(searchValue);

        let matchesRole =
            selectedRole === "all" ||
            user.role === selectedRole;

        let matchesStatus =
            selectedStatus === "all" ||
            user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    userGrid.innerHTML = "";

    resultCount.textContent =
        `${filteredUsers.length} users`;

    emptyState.hidden = filteredUsers.length !== 0;

    filteredUsers.forEach(user => {
        let card = document.createElement("div");
        card.className = "user-card";

        let initials = user.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase();

        let top = document.createElement("div");
        top.className = "user-top";

        let avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = initials;

        let info = document.createElement("div");
        info.className = "user-info";

        let name = document.createElement("h3");
        name.textContent = user.name;

        let username = document.createElement("p");
        username.className = "username";
        username.textContent = "@" + user.username;

        info.append(name, username);

        let status = document.createElement("span");
        status.className = "status " + user.status;
        status.textContent = user.status;

        top.append(avatar, info, status);

        let email = document.createElement("p");
        email.className = "email";
        email.textContent = "✉ " + user.email;

        // Helper to create detail rows
        function createDetail(label, value, useRole = false) {
            let row = document.createElement("div");
            row.className = "detail";

            let labelElement = document.createElement("span");
            labelElement.textContent = label;

            let valueElement = document.createElement("strong");

            if (useRole) {
                let badge = document.createElement("span");
                badge.className = "role";
                badge.textContent = value;
                valueElement.appendChild(badge);
            } else {
                valueElement.textContent = value || "—";
            }

            row.append(labelElement, valueElement);

            return row;
        }

        card.append(
            top,
            email,
            createDetail("Role", user.role, true),
            createDetail("Company", user.company?.name),
            createDetail("Location", user.address?.city),
            createDetail("Phone", user.phone)
        );

        userGrid.appendChild(card);
    });
}

// Search and filters
searchInput.addEventListener("input", showUsers);
roleFilter.addEventListener("change", showUsers);
statusFilter.addEventListener("change", showUsers);

// Start application
fetchUsers();
