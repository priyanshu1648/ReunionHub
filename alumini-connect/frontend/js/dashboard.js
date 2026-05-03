requireAuth();

const user = getUser();
const titleElement = document.getElementById("dashboardTitle");
const subtitleElement = document.getElementById("dashboardSubtitle");
const profileInfo = document.getElementById("profileInfo");
const dashboardJobs = document.getElementById("dashboardJobs");
const jobSectionTitle = document.getElementById("jobSectionTitle");
const noticeElement = document.getElementById("dashboardNotice");
const postJobLink = document.getElementById("postJobLink");
const connectionSectionTitle = document.getElementById("connectionSectionTitle");
const connectionNotice = document.getElementById("connectionNotice");
const connectionRequests = document.getElementById("connectionRequests");
const browseAlumniLink = document.getElementById("browseAlumniLink");
const networkSectionTitle = document.getElementById("networkSectionTitle");
const networkNotice = document.getElementById("networkNotice");
const networkContainer = document.getElementById("networkContainer");

titleElement.textContent = `Welcome, ${user.name}`;
subtitleElement.textContent =
  user.role === "alumni"
    ? "You can receive student requests, guide your juniors, and share opportunities."
    : "You can connect with alumni, build your network, and explore opportunities.";

profileInfo.innerHTML = `
  <div class="profile-item">
    <strong>Name</strong>
    <p>${user.name}</p>
  </div>
  <div class="profile-item">
    <strong>Email</strong>
    <p>${user.email}</p>
  </div>
  <div class="profile-item">
    <strong>Role</strong>
    <p>${user.role}</p>
  </div>
  <div class="profile-item">
    <strong>Course</strong>
    <p>${user.course || "Not added yet"}</p>
  </div>
  <div class="profile-item">
    <strong>Institution</strong>
    <p>${user.institution || "Not added yet"}</p>
  </div>
  <div class="profile-item">
    <strong>Company</strong>
    <p>${user.company || "Not added yet"}</p>
  </div>
  <div class="profile-item">
    <strong>Location</strong>
    <p>${user.location || "Not added yet"}</p>
  </div>
`;

if (user.role === "alumni") {
  postJobLink.classList.remove("hidden");
  connectionSectionTitle.textContent = "Student Requests";
  networkSectionTitle.textContent = "Your Student Network";
  jobSectionTitle.textContent = "Your Posted Jobs";
  setNotice(
    connectionNotice,
    "Students can connect with you from the alumni directory and from jobs you post.",
    "success"
  );
  setNotice(
    networkNotice,
    "Accepted student connections will appear here.",
    "success"
  );
} else {
  browseAlumniLink.classList.remove("hidden");
  connectionSectionTitle.textContent = "Your Sent Requests";
  networkSectionTitle.textContent = "Your Alumni Network";
  setNotice(
    connectionNotice,
    "Browse alumni profiles and send connection requests with a short introduction.",
    "success"
  );
  setNotice(
    networkNotice,
    "When an alumni accepts your request, they will appear here.",
    "success"
  );
  setNotice(
    noticeElement,
    "Jobs are shared by alumni. Use them to discover opportunities and connect with the alumni poster.",
    "success"
  );
  jobSectionTitle.textContent = "Opportunities from Alumni";
}

async function loadConnections() {
  try {
    const endpoint = user.role === "alumni" ? "/connections/received" : "/connections/sent";
    const requests = await apiRequest(endpoint);
    const visibleRequests = requests.filter((request) => request.status !== "accepted");

    connectionRequests.innerHTML = "";

    if (!visibleRequests.length) {
      connectionRequests.innerHTML = `
        <div class="empty-state">
          ${
            user.role === "alumni"
              ? "No pending student requests right now."
              : "No pending connection requests right now."
          }
        </div>
      `;
      return;
    }

    visibleRequests.forEach((request) => {
      connectionRequests.appendChild(
        createConnectionRequestCard(
          request,
          user.role === "alumni" ? "received" : "sent"
        )
      );
    });
  } catch (error) {
    connectionRequests.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

async function loadMyNetwork() {
  try {
    const connections = await apiRequest("/connections/network");

    networkContainer.innerHTML = "";

    if (!connections.length) {
      networkContainer.innerHTML = `
        <div class="empty-state">
          ${
            user.role === "alumni"
              ? "No accepted student connections yet."
              : "No alumni have accepted your requests yet."
          }
        </div>
      `;
      return;
    }

    connections.forEach((connection) => {
      networkContainer.appendChild(createNetworkCard(connection, user.role));
    });
  } catch (error) {
    networkContainer.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

async function loadDashboardJobs() {
  try {
    const jobs = await apiRequest("/jobs");
    const visibleJobs =
      user.role === "alumni"
        ? jobs.filter((job) => job.postedBy && job.postedBy._id === user.id)
        : jobs;

    dashboardJobs.innerHTML = "";

    if (!visibleJobs.length) {
      dashboardJobs.innerHTML = `
        <div class="empty-state">
          ${user.role === "alumni"
            ? "You have not posted any jobs yet."
            : "No jobs are available right now."}
        </div>
      `;
      return;
    }

    visibleJobs.forEach((job) => {
      dashboardJobs.appendChild(createJobCard(job));
    });
  } catch (error) {
    dashboardJobs.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

loadConnections();
loadMyNetwork();
loadDashboardJobs();
