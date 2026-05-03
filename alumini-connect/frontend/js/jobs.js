const jobsContainer = document.getElementById("jobsContainer");
const jobsMessage = document.getElementById("jobsMessage");
const searchInput = document.getElementById("searchInput");

async function loadJobs(search = "") {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const jobs = await apiRequest(`/jobs${query}`);

    jobsContainer.innerHTML = "";
    jobsMessage.classList.add("hidden");

    if (!jobs.length) {
      jobsMessage.textContent = "No jobs found for your search.";
      jobsMessage.classList.remove("hidden");
      return;
    }

    jobs.forEach((job) => {
      jobsContainer.appendChild(createJobCard(job));
    });
  } catch (error) {
    jobsMessage.textContent = error.message;
    jobsMessage.classList.remove("hidden");
  }
}

let searchTimer;
searchInput.addEventListener("input", (event) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadJobs(event.target.value.trim());
  }, 300);
});

loadJobs();
