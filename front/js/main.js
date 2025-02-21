const getbutton = document.querySelector('#fetch-users');
const form = document.querySelector("#create-user");
const lista_de_usuarios = document.getElementById('user-list');

getbutton.addEventListener("click", () => {
  fetch("http://localhost:3000/")
    .then((res) => res.json())
    .then((data) => {
      console.log(data.payload);


      lista_de_usuarios.innerHTML = '';

      data.payload.forEach(el => {
        lista_de_usuarios.innerHTML += `
          <div class="user-card">
            <p><strong>Id:</strong> ${el._id}</p>
            <p><strong>Nombre:</strong> ${el.name}</p>
            <p><strong>Apellido:</strong> ${el.last_name}</p>
            <p><strong>Email:</strong> ${el.email}</p>
            <p><strong>Role:</strong> ${el.role}</p>
          </div>
          <hr>
        `;
      });
    })
    .catch((err) => {
      console.log("No tenes los permisos necesarios");
      lista_de_usuarios.innerHTML += '<h3>No tienes los permisos necesarios</h3>';
    });
});


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const last_name = e.target.last_name.value;
  const email = e.target.email.value;
  const age = e.target.age.value;
  const password = e.target.password.value;
  const role = e.target.role.value;


  fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    body: JSON.stringify({  name, last_name, email, age, password, role  }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        window.location.href = '../pages/perfil.html';
      }
    });
});


