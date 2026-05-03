requireAuth();

const user = getUser();
const accessMessage = document.getElementById("accessMessage");
const jobForm = document.getElementById("jobForm");
const messageElement = document.getElementById("message");

if (user.role !== "alumni") {
  setNotice(accessMessage, "Only alumni can post jobs.", "error");
  Array.from(jobForm.elements).forEach((element) => {
    element.disabled = true;
  });
}

jobForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (user.role !== "alumni") {
    return;
  }

  const payload = {
    title: document.getElementById("title").value.trim(),
    company: document.getElementById("company").value.trim(),
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
    contactInfo: document.getElementById("contactInfo").value.trim(),
  };

  const hasEmptyField = Object.values(payload).some((value) => !value);
  if (hasEmptyField) {
    return setMessage(messageElement, "Please fill in all fields.", "error");
  }

  try {
    await apiRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    jobForm.reset();
    setMessage(messageElement, "Job posted successfully.", "success");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (error) {
    setMessage(messageElement, error.message, "error");
  }
});
