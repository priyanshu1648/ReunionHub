const alumniContainer = document.getElementById("alumniContainer");
const alumniMessage = document.getElementById("alumniMessage");
const alumniSearchInput = document.getElementById("alumniSearchInput");
const institutionInput = document.getElementById("institutionInput");
const institutionHint = document.getElementById("institutionHint");
const currentUser = getUser();
let latestAlumniRequestId = 0;

function buildAlumniSignature(alumni) {
  return [
    alumni.name,
    alumni.institution,
    alumni.course,
    alumni.company,
    alumni.location,
    alumni.graduationYear,
    alumni.bio,
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

if (currentUser?.institution) {
  institutionInput.value = currentUser.institution;
  setNotice(
    institutionHint,
    `Showing alumni from ${currentUser.institution}. Change the college or school name to explore another institution.`,
    "success"
  );
}

async function loadAlumni(search = "", institution = "") {
  const requestId = ++latestAlumniRequestId;

  try {
    const queryParams = new URLSearchParams();
    if (search) {
      queryParams.set("search", search);
    }
    if (institution) {
      queryParams.set("institution", institution);
    }
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const alumniList = await apiRequest(`/users/alumni${query}`);

    if (requestId !== latestAlumniRequestId) {
      return;
    }

    const uniqueAlumni = alumniList.filter((alumni, index, list) => {
      const uniqueKey = alumni._id || alumni.email || buildAlumniSignature(alumni);
      return (
        index ===
        list.findIndex((item) => {
          const itemKey = item._id || item.email || buildAlumniSignature(item);
          return itemKey === uniqueKey;
        })
      );
    });

    alumniContainer.innerHTML = "";
    alumniMessage.classList.add("hidden");

    if (!uniqueAlumni.length) {
      alumniMessage.textContent = institution
        ? `No alumni profiles found for ${institution}.`
        : "No alumni profiles found.";
      alumniMessage.classList.remove("hidden");
      return;
    }

    uniqueAlumni.forEach((alumni) => {
      alumniContainer.appendChild(createAlumniCard(alumni));
    });
  } catch (error) {
    if (requestId !== latestAlumniRequestId) {
      return;
    }
    alumniMessage.textContent = error.message;
    alumniMessage.classList.remove("hidden");
  }
}

let alumniSearchTimer;
alumniSearchInput.addEventListener("input", (event) => {
  clearTimeout(alumniSearchTimer);
  alumniSearchTimer = setTimeout(() => {
    loadAlumni(event.target.value.trim(), institutionInput.value.trim());
  }, 300);
});

let institutionTimer;
institutionInput.addEventListener("input", (event) => {
  clearTimeout(institutionTimer);
  institutionTimer = setTimeout(() => {
    const institution = event.target.value.trim();
    if (institution) {
      setNotice(
        institutionHint,
        `Showing alumni from ${institution}.`,
        "success"
      );
    } else {
      institutionHint.classList.add("hidden");
    }
    loadAlumni(alumniSearchInput.value.trim(), institution);
  }, 300);
});

loadAlumni("", institutionInput.value.trim());
