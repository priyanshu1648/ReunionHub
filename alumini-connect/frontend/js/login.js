redirectIfLoggedIn();

const loginForm = document.getElementById("loginForm");
const messageElement = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return setMessage(messageElement, "Please enter email and password.", "error");
  }

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    saveAuth(data.token, data.user);
    setMessage(messageElement, "Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 700);
  } catch (error) {
    setMessage(messageElement, error.message, "error");
  }
});
