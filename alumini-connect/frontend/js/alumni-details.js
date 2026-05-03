const alumniDetailsContainer = document.getElementById("alumniDetailsContainer");
const alumniParams = new URLSearchParams(window.location.search);
const alumniId = alumniParams.get("id");

function renderAlumniProfile(alumni, jobs) {
  const user = getUser();
  const canConnect = user?.role === "student";

  alumniDetailsContainer.innerHTML = `
    <div class="details-header">
      <div>
        <p class="eyebrow">${escapeHtml(alumni.company || "Alumni Network")}</p>
        <h1>${escapeHtml(alumni.name)}</h1>
        <p class="muted-text">
          ${escapeHtml(alumni.course || "Course not shared")} •
          ${escapeHtml(alumni.location || "Location not shared")}
        </p>
      </div>
      <span class="tag">${escapeHtml(alumni.graduationYear || "Alumni")}</span>
    </div>

    <div class="details-grid">
      <div class="details-panel">
        <h2>About</h2>
        <p>${escapeHtml(alumni.bio || "This alumni is available for student networking and guidance.")}</p>
        <div class="top-gap details-list">
          <p><strong>Institution:</strong> ${escapeHtml(alumni.institution || "Not shared")}</p>
          <p><strong>Email:</strong> ${escapeHtml(alumni.email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(alumni.company || "Not shared")}</p>
          <p><strong>Course:</strong> ${escapeHtml(alumni.course || "Not shared")}</p>
          <p><strong>Location:</strong> ${escapeHtml(alumni.location || "Not shared")}</p>
        </div>
        <div class="job-actions top-gap">
          ${
            canConnect
              ? `<button class="btn btn-primary alumni-profile-connect-btn" type="button">Send Connection Request</button>`
              : ""
          }
          <a class="btn btn-secondary" href="mailto:${escapeHtml(alumni.email)}">Email Alumni</a>
        </div>
      </div>

      <div class="details-panel">
        <h2>Shared Opportunities</h2>
        ${
          jobs.length
            ? `<div id="alumniOpportunities" class="mini-list"></div>`
            : `<p>This alumni has not shared any opportunities yet.</p>`
        }
      </div>
    </div>
  `;

  const connectBtn = alumniDetailsContainer.querySelector(".alumni-profile-connect-btn");
  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      openConnectionModal(alumni, `connecting with ${alumni.name}`);
    });
  }

  const opportunitiesContainer = document.getElementById("alumniOpportunities");
  if (opportunitiesContainer) {
    jobs.forEach((job) => {
      const item = document.createElement("a");
      item.className = "mini-list-item";
      item.href = `./job-details.html?id=${job._id}`;
      item.innerHTML = `
        <strong>${escapeHtml(job.title)}</strong>
        <span>${escapeHtml(job.company)} • ${escapeHtml(job.location)}</span>
      `;
      opportunitiesContainer.appendChild(item);
    });
  }
}

async function loadAlumniProfile() {
  if (!alumniId) {
    alumniDetailsContainer.innerHTML = `<p class="empty-state">Alumni profile ID is missing.</p>`;
    return;
  }

  try {
    const [alumni, jobs] = await Promise.all([
      apiRequest(`/users/alumni/${alumniId}`),
      apiRequest("/jobs"),
    ]);

    const alumniJobs = jobs.filter((job) => job.postedBy && job.postedBy._id === alumniId);
    renderAlumniProfile(alumni, alumniJobs);
  } catch (error) {
    alumniDetailsContainer.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

loadAlumniProfile();
