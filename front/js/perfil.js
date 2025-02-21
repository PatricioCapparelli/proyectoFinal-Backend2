fetch('http://localhost:3000/current', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success') {
        console.log('Perfil del usuario:', data.payload);
      } else {
        console.log('Error al obtener el perfil:', data.message);
      }
    })
    .catch((error) => {
      console.log('Error en la solicitud:', error);
    });
