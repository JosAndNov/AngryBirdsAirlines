const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contraseña })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('mensaje').innerText = '✅ Login exitoso';

    // Guardar token y nombre del usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario.nombre);

    // Redirigir al inicio
    window.location.href = '/inicio.html';
  } else {
    document.getElementById('mensaje').innerText = `❌ ${data.mensaje || 'Error al iniciar sesión'}`;
  }
});

  function mostrarContraseña() {
    const input = document.getElementById('contraseña');
    input.type = input.type === 'password' ? 'text' : 'password';
  }


