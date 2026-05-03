requireAuth();

const user = getUser();
const networkPageTitle = document.getElementById("networkPageTitle");
const networkPageSubtitle = document.getElementById("networkPageSubtitle");
const networkPageNotice = document.getElementById("networkPageNotice");
const networkPageContainer = document.getElementById("networkPageContainer");
const networkPageMessage = document.getElementById("networkPageMessage");
const networkSearchInput = document.getElementById("networkSearchInput");

networkPageTitle.textContent =
  user.role === "alumni" ? "Your Student Network" : "Your Alumni Network";
networkPageSubtitle.textContent =
  user.role === "alumni"
    ? "Browse all students who are now connected with you."
    : "Browse all alumni who accepted your connection requests.";
setNotice(
  networkPageNotice,
  user.role === "alumni"
    ? "Use this page to keep track of students you can guide and support."
    : "Use this page to keep track of alumni you can reach out to for guidance.",
  "success"
);

let allConnections = [];

function matchesNetworkSearch(connection, search) {
  if (!search) {
    return true;
  }

  const person = user.role === "alumni" ? connection.student : connection.alumni;
  const haystack = [
    person?.name,
    person?.email,
    person?.company,
    person?.course,
    person?.institution,
    person?.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(search.toLowerCase());
}

function renderNetwork(connections) {
  networkPageContainer.innerHTML = "";
  networkPageMessage.classList.add("hidden");

  if (!connections.length) {
    networkPageMessage.textContent =
      allConnections.length === 0
        ? user.role === "alumni"
          ? "No accepted student connections yet."
          : "No alumni have accepted your requests yet."
        : "No connections match your search.";
    networkPageMessage.classList.remove("hidden");
    return;
  }

  connections.forEach((connection) => {
    networkPageContainer.appendChild(createNetworkCard(connection, user.role));
  });
}

async function loadNetworkPage() {
  try {
    allConnections = await apiRequest("/connections/network");
    renderNetwork(allConnections);
  } catch (error) {
    networkPageMessage.textContent = error.message;
    networkPageMessage.classList.remove("hidden");
  }
}

let networkSearchTimer;
networkSearchInput.addEventListener("input", (event) => {
  clearTimeout(networkSearchTimer);
  networkSearchTimer = setTimeout(() => {
    const filtered = allConnections.filter((connection) =>
      matchesNetworkSearch(connection, event.target.value.trim())
    );
    renderNetwork(filtered);
  }, 250);
});

loadNetworkPage();
