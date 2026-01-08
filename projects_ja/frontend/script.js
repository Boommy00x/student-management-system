// Config
const API_BASE_URL = "http://localhost:3000";

// DOM Elements
const usersList = document.getElementById("usersList");
const userDetail = document.getElementById("userDetail");
const getAllBtn = document.getElementById("getAllBtn");
const filterBtn = document.getElementById("filterBtn");
const roleFilter = document.getElementById("roleFilter");
const searchBtn = document.getElementById("searchBtn");
const userIdInput = document.getElementById("userIdInput");
const addUserForm = document.getElementById("addUserForm");
const apiLog = document.getElementById("apiLog");
const clearLogBtn = document.getElementById("clearLogBtn");
const apiStatus = document.getElementById("apiStatus");
const toast = document.getElementById("toast");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadAllUsers();
    checkAPIStatus();

    // Auto-refresh every 30 seconds
    setInterval(checkAPIStatus, 30000);
});

// Utility Functions
function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function addLog(message, type = "info") {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="time">[${time}]</span>
        <span class="message">${message}</span>
    `;

    apiLog.appendChild(logEntry);
    apiLog.scrollTop = apiLog.scrollHeight;
}

// API Functions
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            apiStatus.innerHTML = '<i class="fas fa-circle"></i> API Connected';
            apiStatus.className = "status online";
        } else {
            throw new Error("API Error");
        }
    } catch (error) {
        apiStatus.innerHTML = '<i class="fas fa-circle"></i> API Disconnected';
        apiStatus.className = "status offline";
        addLog("ไม่สามารถเชื่อมต่อกับ API", "error");
    }
}

async function loadAllUsers(filterRole = "") {
    try {
        addLog("กำลังโหลดข้อมูลผู้ใช้...", "info");

        const url = filterRole
            ? `${API_BASE_URL}/users?role=${filterRole}`
            : `${API_BASE_URL}/users`;

        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const users = await response.json();

        if (users.length === 0) {
            usersList.innerHTML =
                '<div class="loading">ไม่พบข้อมูลผู้ใช้</div>';
            addLog("ไม่พบข้อมูลผู้ใช้", "info");
            return;
        }

        renderUsersList(users);
        addLog(`โหลดข้อมูลผู้ใช้สำเร็จ (${users.length} คน)`, "success");
    } catch (error) {
        usersList.innerHTML =
            '<div class="loading error">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
        addLog(`ข้อผิดพลาด: ${error.message}`, "error");
        showToast("ไม่สามารถโหลดข้อมูลได้", "error");
    }
}

async function searchUserById(id) {
    if (!id) {
        showToast("กรุณาป้อน ID", "error");
        return;
    }

    try {
        addLog(`กำลังค้นหาผู้ใช้ ID: ${id}`, "info");

        const response = await fetch(`${API_BASE_URL}/users/${id}`);

        if (response.status === 404) {
            userDetail.innerHTML = `
                <div class="user-card error">
                    <div class="user-id">ไม่พบข้อมูล</div>
                    <p>ไม่พบผู้ใช้ที่มี ID: ${id}</p>
                </div>
            `;
            addLog(`ไม่พบผู้ใช้ ID: ${id}`, "error");
            showToast("ไม่พบผู้ใช้", "error");
            return;
        }

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const user = await response.json();
        renderUserDetail(user);
        addLog(`พบผู้ใช้: ${user.name} (ID: ${user.id})`, "success");
        showToast("พบข้อมูลผู้ใช้แล้ว", "success");
    } catch (error) {
        userDetail.innerHTML =
            '<div class="loading error">เกิดข้อผิดพลาดในการค้นหา</div>';
        addLog(`ข้อผิดพลาด: ${error.message}`, "error");
        showToast("เกิดข้อผิดพลาดในการค้นหา", "error");
    }
}

async function addNewUser(userData) {
    try {
        addLog("กำลังเพิ่มผู้ใช้ใหม่...", "info");

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const newUser = await response.json();

        addLog(
            `เพิ่มผู้ใช้สำเร็จ: ${newUser.name} (ID: ${newUser.id})`,
            "success",
        );
        showToast("เพิ่มผู้ใช้สำเร็จ!", "success");

        // Refresh user list
        loadAllUsers();

        // Clear form
        addUserForm.reset();
    } catch (error) {
        addLog(`ข้อผิดพลาด: ${error.message}`, "error");
        showToast("ไม่สามารถเพิ่มผู้ใช้ได้", "error");
    }
}

// Render Functions
function renderUsersList(users) {
    usersList.innerHTML = users
        .map(
            (user) => `
        <div class="user-card ${user.role}">
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-name">${user.name}</div>
            <div class="user-details">
                <div>
                    <strong>Username:</strong> ${user.username || "N/A"}
                </div>
                <div>
                    <strong>Email:</strong> ${user.email || "N/A"}
                </div>
                <div>
                    <strong>Role:</strong>
                    <span class="user-role ${user.role}">${user.role}</span>
                </div>
            </div>
        </div>
    `,
        )
        .join("");
}

function renderUserDetail(user) {
    userDetail.innerHTML = `
        <div class="user-card ${user.role}">
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-name">${user.name}</div>
            <div class="user-details">
                <div>
                    <strong>Username:</strong> ${user.username || "N/A"}
                </div>
                <div>
                    <strong>Email:</strong> ${user.email || "N/A"}
                </div>
                <div>
                    <strong>Role:</strong>
                    <span class="user-role ${user.role}">${user.role}</span>
                </div>
            </div>
        </div>
    `;
}

// Event Listeners
getAllBtn.addEventListener("click", () => {
    loadAllUsers();
    showToast("รีเฟรชข้อมูลแล้ว", "info");
});

filterBtn.addEventListener("click", () => {
    const role = roleFilter.value.trim();
    if (role) {
        loadAllUsers(role);
        showToast(`กรองตามสิทธิ์: ${role}`, "info");
    } else {
        loadAllUsers();
    }
});

roleFilter.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        filterBtn.click();
    }
});

searchBtn.addEventListener("click", () => {
    const id = userIdInput.value.trim();
    searchUserById(id);
});

userIdInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userData = {
        name: document.getElementById("name").value.trim(),
        role: document.getElementById("role").value,
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
    };

    // Basic validation
    if (
        !userData.name ||
        !userData.role ||
        !userData.username ||
        !userData.email
    ) {
        showToast("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
        return;
    }

    addNewUser(userData);
});

clearLogBtn.addEventListener("click", () => {
    apiLog.innerHTML = `
        <div class="log-entry info">
            <span class="time">[ล้างแล้ว]</span>
            <span class="message">Log ถูกล้างเรียบร้อย</span>
        </div>
    `;
    addLog("ล้าง log เรียบร้อย", "info");
});

// Handle API errors globally
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
    addLog(`ข้อผิดพลาด: ${event.reason.message}`, "error");
});
