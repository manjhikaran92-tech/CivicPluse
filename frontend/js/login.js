const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Tab toggle
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active"); tabRegister.classList.remove("active");
  loginForm.classList.remove("hidden"); registerForm.classList.add("hidden");
});
tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active"); tabLogin.classList.remove("active");
  registerForm.classList.remove("hidden"); loginForm.classList.add("hidden");
});

// LOGIN
document.querySelector("#loginForm .btn-primary").addEventListener("click", async () => {
  const phone = document.querySelector("#loginForm input[type='text']").value.trim();
  const password = document.querySelector("#loginForm input[type='password']").value.trim();
  if (!phone || !password) return alert("Phone and password required!");
  try {
    const data = await Auth.login({ phone, password });
    setAuth(data);
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message);
  }
});

// REGISTER
document.querySelector("#registerForm .btn-primary").addEventListener("click", async () => {
  const name     = document.querySelector("#registerForm input[type='text']").value.trim();
  const phone    = document.querySelector("#registerForm input[type='tel']").value.trim();
  const city     = document.querySelectorAll("#registerForm input[type='text']")[1].value.trim();
  const password = document.querySelector("#registerForm input[type='password']").value.trim();
  if (!name || !phone || !password) return alert("All fields required!");
  try {
    const data = await Auth.register({ name, phone, city, password });
    setAuth(data);
    window.location.href = 'index.html';
  } catch (err) {
    alert(err.message);
  }
});

// Auto redirect if already logged in
if (getToken()) window.location.href = 'index.html';