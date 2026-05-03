redirectIfLoggedIn();

const registerForm = document.getElementById("registerForm");
const messageElement = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const course = document.getElementById("course").value.trim();
  const institution = document.getElementById("institution").value.trim();
  const company = document.getElementById("company").value.trim();
  const graduationYear = document.getElementById("graduationYear").value.trim();
  const location = document.getElementById("location").value.trim();
  const bio = document.getElementById("bio").value.trim();

  if (!name || !email || !password || !role) {
    return setMessage(messageElement, "Please fill in all fields.", "error");
  }

  if (password.length < 6) {
    return setMessage(
      messageElement,
      "Password must be at least 6 characters long.",
      "error"
    );
  }

  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        course,
        institution,
        company,
        graduationYear,
        location,
        bio,
      }),
    });

    saveAuth(data.token, data.user);
    setMessage(messageElement, "Registration successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 700);
  } catch (error) {
    setMessage(messageElement, error.message, "error");
  }
});
