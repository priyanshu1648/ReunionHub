const TOKEN_KEY = "alumniPortalToken";
const USER_KEY = "alumniPortalUser";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "./login.html";
}

function redirectIfLoggedIn() {
  if (getToken()) {
    window.location.href = "./dashboard.html";
  }
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "./login.html";
  }
}

function setMessage(element, message, type) {
  element.textContent = message;
  element.className = `form-message ${type}`;
}

function setNotice(element, message, type) {
  element.textContent = message;
  element.classList.remove("hidden", "success", "error");
  if (type) {
    element.classList.add(type);
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getContactDetails(rawContactInfo) {
  const contactInfo = String(rawContactInfo || "").trim();
  const emailMatch = contactInfo.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = contactInfo.match(/(?:\+?\d[\d\s-]{7,}\d)/);

  if (emailMatch) {
    return {
      href: `mailto:${emailMatch[0]}`,
      label: "Email Contact",
      value: emailMatch[0],
    };
  }

  if (phoneMatch) {
    const phoneNumber = phoneMatch[0].replace(/\s+/g, "");
    return {
      href: `tel:${phoneNumber}`,
      label: "Call Contact",
      value: phoneMatch[0],
    };
  }

  return {
    href: null,
    label: "Copy Contact",
    value: contactInfo,
  };
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied successfully.");
  } catch (error) {
    window.prompt("Copy this text:", text);
  }
}

function createNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    return;
  }

  const page = document.body.dataset.page;
  const user = getUser();
  const isLoggedIn = Boolean(user);

  navbar.className = "navbar";
  navbar.innerHTML = `
    <a href="./index.html" class="brand">Alumni Connect</a>
    <div class="nav-links">
      <a href="./index.html" class="${page === "home" ? "active" : ""}">Home</a>
      <a href="./alumni.html" class="${page === "alumni" ? "active" : ""}">Alumni</a>
      <a href="./jobs.html" class="${page === "jobs" || page === "job-details" ? "active" : ""}">Opportunities</a>
      ${
        isLoggedIn
          ? `<a href="./dashboard.html" class="${page === "dashboard" || page === "network" || page === "edit-profile" ? "active" : ""}">Dashboard</a>`
          : ""
      }
      ${
        isLoggedIn && user.role === "alumni"
          ? `<a href="./post-job.html" class="${page === "post-job" ? "active" : ""}">Post Job</a>`
          : ""
      }
      ${
        isLoggedIn
          ? `<button id="logoutBtn" type="button">Logout</button>`
          : `<a href="./login.html" class="${page === "login" ? "active" : ""}">Login</a>
             <a href="./register.html" class="${page === "register" ? "active" : ""}">Register</a>`
      }
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

function ensureConnectionModal() {
  if (document.getElementById("connectionModal")) {
    return;
  }

  const modal = document.createElement("div");
  modal.id = "connectionModal";
  modal.className = "modal hidden";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-modal="true"></div>
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Connect with Alumni</p>
          <h2 id="connectionModalTitle">Send a Connection Request</h2>
        </div>
        <button id="closeConnectionModalBtn" class="icon-btn" type="button">X</button>
      </div>
      <p id="connectionModalHelp" class="muted-text"></p>
      <form id="connectionForm" class="form">
        <label>
          Your Message
          <textarea
            id="connectionMessage"
            rows="5"
            placeholder="Explain why you want to connect with this alumni"
            required
          ></textarea>
        </label>
        <button class="btn btn-primary" type="submit">Send Request</button>
        <p id="connectionStatus" class="form-message"></p>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target.dataset.closeModal === "true") {
      closeConnectionModal();
    }
  });

  document
    .getElementById("closeConnectionModalBtn")
    .addEventListener("click", closeConnectionModal);
  document
    .getElementById("connectionForm")
    .addEventListener("submit", handleConnectionSubmit);
}

function openConnectionModal(alumni, contextText = "") {
  ensureConnectionModal();

  const user = getUser();
  const modal = document.getElementById("connectionModal");
  const status = document.getElementById("connectionStatus");
  const messageField = document.getElementById("connectionMessage");

  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  if (user.role !== "student") {
    alert("Only students can send connection requests to alumni.");
    return;
  }

  modal.dataset.alumniId = alumni._id || alumni.id || "";
  modal.dataset.alumniName = alumni.name || "Alumni";

  document.getElementById(
    "connectionModalTitle"
  ).textContent = `Connect with ${alumni.name || "Alumni"}`;
  document.getElementById("connectionModalHelp").textContent =
    contextText || `Send a short note to connect with ${alumni.name || "this alumni"}.`;

  messageField.value = `Hello ${alumni.name || "there"},\n\nI am a student and would like to connect with you${
    contextText ? ` regarding ${contextText.toLowerCase()}` : ""
  }. I would appreciate your guidance.\n\nThank you.`;
  status.textContent = "";
  status.className = "form-message";

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeConnectionModal() {
  const modal = document.getElementById("connectionModal");
  if (!modal) {
    return;
  }

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

async function handleConnectionSubmit(event) {
  event.preventDefault();

  const modal = document.getElementById("connectionModal");
  const status = document.getElementById("connectionStatus");
  const message = document.getElementById("connectionMessage").value.trim();

  if (!message) {
    return setMessage(status, "Please write a message before sending.", "error");
  }

  try {
    await apiRequest(`/connections/${modal.dataset.alumniId}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    setMessage(status, "Connection request sent successfully.", "success");
    setTimeout(() => {
      closeConnectionModal();
    }, 800);
  } catch (error) {
    setMessage(status, error.message, "error");
  }
}

function createConnectionRequestCard(request, mode) {
  const card = document.createElement("article");
  card.className = "job-card";

  const person = mode === "received" ? request.student : request.alumni;
  const subtitle =
    mode === "received"
      ? `${person?.course || "Student"}${person?.location ? ` - ${person.location}` : ""}`
      : `${person?.company || "Alumni"}${person?.location ? ` - ${person.location}` : ""}`;

  card.innerHTML = `
    <div>
      <span class="tag">${escapeHtml(request.status)}</span>
      <h3>${escapeHtml(person?.name || "Connection")}</h3>
    </div>
    <div class="job-meta">
      <span>${escapeHtml(subtitle)}</span>
      <span>${formatDate(request.createdAt)}</span>
    </div>
    <p>${escapeHtml(request.message)}</p>
    <div class="job-footer">
      <span class="muted-text">${escapeHtml(person?.email || "")}</span>
      ${
        mode === "received" && request.status === "pending"
          ? `<div class="job-actions">
               <button class="btn btn-primary request-action-btn" data-status="accepted" type="button">Accept</button>
               <button class="btn btn-secondary request-action-btn" data-status="declined" type="button">Decline</button>
             </div>`
          : ""
      }
    </div>
  `;

  if (mode === "received" && request.status === "pending") {
    card.querySelectorAll(".request-action-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await apiRequest(`/connections/${request._id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: button.dataset.status }),
          });
          window.location.reload();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  }

  return card;
}

function createNetworkCard(connection, userRole) {
  const person = userRole === "alumni" ? connection.student : connection.alumni;
  const card = document.createElement("article");
  card.className = "job-card";

  const subtitle =
    userRole === "alumni"
      ? `${person?.course || "Student"}${person?.institution ? ` - ${person.institution}` : ""}`
      : `${person?.company || "Alumni"}${person?.institution ? ` - ${person.institution}` : ""}`;

  card.innerHTML = `
    <div>
      <span class="tag">Connected</span>
      <h3>${escapeHtml(person?.name || "Connection")}</h3>
    </div>
    <div class="job-meta">
      <span>${escapeHtml(subtitle)}</span>
      <span>Accepted ${formatDate(connection.updatedAt || connection.createdAt)}</span>
    </div>
    <p>${escapeHtml(person?.bio || "This connection is now part of your network.")}</p>
    <div class="job-footer">
      <div class="job-actions">
        <a class="btn btn-primary" href="./chat.html?connectionId=${connection._id}">Open Chat</a>
        ${
          userRole === "student" && person?._id
            ? `<a class="btn btn-secondary" href="./alumni-details.html?id=${person._id}">View Profile</a>`
            : ""
        }
        ${
          userRole === "alumni" && person?.email
            ? `<a class="btn btn-secondary" href="mailto:${escapeHtml(person.email)}?subject=${encodeURIComponent(
                "Guidance from Alumni Connect"
              )}">Reach Out</a>`
            : ""
        }
        <a class="btn btn-secondary" href="mailto:${escapeHtml(person?.email || "")}">Email</a>
      </div>
      <span class="muted-text">${escapeHtml(person?.location || "Location not shared")}</span>
    </div>
  `;

  return card;
}

function createAlumniCard(alumni) {
  const card = document.createElement("article");
  card.className = "job-card";

  const user = getUser();
  const isStudent = user?.role === "student";

  card.innerHTML = `
    <div>
      <span class="tag">${escapeHtml(alumni.company || "Alumni Network")}</span>
      <h3>${escapeHtml(alumni.name)}</h3>
    </div>
    <div class="job-meta">
      <span>${escapeHtml(alumni.location || "Location not shared")}</span>
      <span>${escapeHtml(alumni.graduationYear || "Graduation year not shared")}</span>
    </div>
    <p>${escapeHtml(alumni.bio || "Open to connecting with students from the portal.")}</p>
    <div class="job-meta">
      <span>${escapeHtml(alumni.course || "Course not shared")}</span>
      <span>${escapeHtml(alumni.institution || "Institution not shared")}</span>
      <span>${escapeHtml(alumni.email)}</span>
    </div>
    <div class="job-footer">
      <div class="job-actions">
        <a class="btn btn-secondary" href="./alumni-details.html?id=${alumni._id}">View Profile</a>
        ${
          isStudent
            ? `<button class="btn btn-primary alumni-connect-btn" type="button">Connect</button>`
            : ""
        }
        <a class="btn btn-secondary" href="mailto:${escapeHtml(alumni.email)}">Email Alumni</a>
      </div>
      <span class="muted-text">${escapeHtml(alumni.company || "")}</span>
    </div>
  `;

  const connectBtn = card.querySelector(".alumni-connect-btn");
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      openConnectionModal(alumni, `connecting with ${alumni.name}`);
    });
  }

  return card;
}

function createJobCard(job) {
  const card = document.createElement("article");
  card.className = "job-card";

  const user = getUser();
  const alumniName = escapeHtml(job.postedBy?.name || "Alumni");
  const alumniEmail = escapeHtml(job.postedBy?.email || "");
  const contact = getContactDetails(job.contactInfo);
  const safeContactValue = escapeHtml(contact.value || job.contactInfo || "");
  const safeDescription = escapeHtml(job.description);
  const safeTitle = escapeHtml(job.title);
  const safeCompany = escapeHtml(job.company);
  const safeLocation = escapeHtml(job.location);
  const isOwner = user && job.postedBy && job.postedBy._id === user.id;
  const canConnect = user?.role === "student" && !isOwner;

  card.innerHTML = `
    <div>
      <span class="tag">${safeCompany}</span>
      <h3>${safeTitle}</h3>
    </div>
    <div class="job-meta">
      <span>${safeLocation}</span>
      <span>Posted ${formatDate(job.createdAt)}</span>
    </div>
    <p>${safeDescription}</p>
    <div class="job-meta">
      <span>Posted by ${alumniName}</span>
      <span>Contact: ${safeContactValue}</span>
    </div>
    <div class="job-footer">
      <div class="job-actions">
        <a class="btn btn-secondary" href="./job-details.html?id=${job._id}">View Details</a>
        ${
          canConnect
            ? `<button class="btn btn-primary connect-job-btn" type="button">Connect with Alumni</button>`
            : ""
        }
        ${
          contact.href
            ? `<a class="btn btn-secondary" href="${contact.href}">${contact.label}</a>`
            : `<button class="btn btn-secondary copy-contact-btn" type="button">Copy Contact</button>`
        }
      </div>
      <span class="muted-text">${
        isOwner ? "This is your posted opportunity." : `Alumni email: ${alumniEmail || "Not available"}`
      }</span>
    </div>
  `;

  const connectBtn = card.querySelector(".connect-job-btn");
  const copyButton = card.querySelector(".copy-contact-btn");

  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      openConnectionModal(job.postedBy, `${job.title} opportunity at ${job.company}`);
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", () => {
      copyText(contact.value || job.contactInfo || "");
    });
  }

  return card;
}

createNavbar();
