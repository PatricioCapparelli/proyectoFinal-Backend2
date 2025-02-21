const form = document.getElementById('form');

form.addEventListener('submit', () => {
fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify({  email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(data => {
      if (data.token) {
        window.location.href = './pages/perfil.html';
      }
    })
})
