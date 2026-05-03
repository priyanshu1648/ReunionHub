const detailsContainer = document.getElementById("jobDetailsContainer");
const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

function renderJobDetails(job) {
  const user = getUser();
  const isOwner = user && job.postedBy && job.postedBy._id === user.id;
  const canConnect = user?.role === "student" && !isOwner;
  const contact = getContactDetails(job.contactInfo);
  const contactAction = contact.href
    ? `<a class="btn btn-secondary" href="${contact.href}">${contact.label}</a>`
    : `<button class="btn btn-secondary detail-copy-contact-btn" type="button">Copy Contact</button>`;

  detailsContainer.innerHTML = `
    <div class="details-header">
      <div>
        <p class="eyebrow">${escapeHtml(job.company)}</p>
        <h1>${escapeHtml(job.title)}</h1>
        <p class="muted-text">Posted ${formatDate(job.createdAt)} in ${escapeHtml(
    job.location
  )}</p>
      </div>
      <span class="tag">Posted by ${escapeHtml(job.postedBy?.name || "Alumni")}</span>
    </div>

    <div class="details-grid">
      <div class="details-panel">
        <h2>About this opportunity</h2>
        <p>${escapeHtml(job.description)}</p>
      </div>
      <div class="details-panel">
        <h2>Alumni Connection</h2>
        <p><strong>Alumni Name:</strong> ${escapeHtml(job.postedBy?.name || "Alumni")}</p>
        <p><strong>Alumni Email:</strong> ${escapeHtml(job.postedBy?.email || "Not available")}</p>
        <p><strong>Contact Info:</strong> ${escapeHtml(job.contactInfo)}</p>
        <div class="job-actions top-gap">
          <a class="btn btn-secondary" href="./alumni-details.html?id=${job.postedBy?._id}">View Alumni Profile</a>
          ${
            canConnect
              ? `<button class="btn btn-primary detail-connect-btn" type="button">Connect with Alumni</button>`
              : ""
          }
          ${contactAction}
        </div>
        ${
          isOwner
            ? `<p class="notice success top-gap">This job was posted by you, so connect/apply actions are hidden.</p>`
            : ""
        }
      </div>
    </div>
  `;

  const connectBtn = detailsContainer.querySelector(".detail-connect-btn");
  const copyBtn = detailsContainer.querySelector(".detail-copy-contact-btn");

  if (connectBtn) {
    connectBtn.addEventListener("click", () => {
      openConnectionModal(job.postedBy, `${job.title} opportunity at ${job.company}`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyText(contact.value || job.contactInfo || "");
    });
  }
}

async function loadJobDetails() {
  if (!jobId) {
    detailsContainer.innerHTML = `<p class="empty-state">Job ID is missing.</p>`;
    return;
  }

  try {
    const job = await apiRequest(`/jobs/${jobId}`);
    renderJobDetails(job);
  } catch (error) {
    detailsContainer.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

loadJobDetails();
