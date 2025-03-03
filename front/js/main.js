const getbutton = document.querySelector('#fetch-users');
const form = document.querySelector("#create-user");
const lista_de_usuarios = document.getElementById('user-list');

getbutton.addEventListener("click", () => {
  fetch("http://localhost:3000/api/users/",{
    method: "GET",
    credentials: 'include',
  })
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

  const nombre = e.target.nombre.value;
  const apellido = e.target.apellido.value;
  const email = e.target.email.value;
  const edad = e.target.edad.value;
  const contraseña = e.target.contraseña.value;
  const rol = e.target.rol.value;

  console.log({ nombre, apellido, email, edad, contraseña, rol });

  fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    body: JSON.stringify({ nombre, apellido, email, edad, contraseña, rol }),
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
})
.then(async (response) => {
    const data = await response.json();

    console.log("Respuesta del servidor:", data);

    if (response.status === 201 || response.status === 200) {

        const token = data.token;
        console.log("Usuario creado exitosamente. Token:", token);

        if (token) {
            localStorage.setItem('token', token);
            window.location.href = "http://localhost:3000/api/views/login";
        }
    } else {
        console.error("Error en la creación del usuario:", data.message || "Error desconocido");
    }
})
.catch((err) => {
    console.error("Error al hacer la solicitud:", err);
});
});

