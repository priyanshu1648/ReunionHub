requireAuth();

const user = getUser();
const editProfileForm = document.getElementById("editProfileForm");
const messageElement = document.getElementById("message");

document.getElementById("name").value = user.name || "";
document.getElementById("email").value = user.email || "";
document.getElementById("role").value = user.role || "";
document.getElementById("course").value = user.course || "";
document.getElementById("institution").value = user.institution || "";
document.getElementById("company").value = user.company || "";
document.getElementById("graduationYear").value = user.graduationYear || "";
document.getElementById("location").value = user.location || "";
document.getElementById("bio").value = user.bio || "";

editProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    course: document.getElementById("course").value.trim(),
    institution: document.getElementById("institution").value.trim(),
    company: document.getElementById("company").value.trim(),
    graduationYear: document.getElementById("graduationYear").value.trim(),
    location: document.getElementById("location").value.trim(),
    bio: document.getElementById("bio").value.trim(),
  };

  if (!payload.name) {
    return setMessage(messageElement, "Name is required.", "error");
  }

  try {
    const data = await apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    saveAuth(getToken(), data.user);
    setMessage(messageElement, "Profile updated successfully.", "success");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 700);
  } catch (error) {
    setMessage(messageElement, error.message, "error");
  }
});
