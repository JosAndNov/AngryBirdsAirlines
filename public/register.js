const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contraseña })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('mensaje').innerText = '✅ Usuario registrado exitosamente';
    // Redirigir al login (opcional):
    // window.location.href = '/login.html';
  } else {
    document.getElementById('mensaje').innerText = `❌ ${data.mensaje || 'Error al registrar'}`;
  }
});

function mostrarContraseña() {
    const input = document.getElementById('contraseña');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

