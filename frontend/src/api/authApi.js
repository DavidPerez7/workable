const API_URL = "http://localhost:8080/api/auth"; 

export const login = async (credenciales) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });

  if (!res.ok) throw new Error("Error al iniciar sesión");

  const data = await res.json();

  localStorage.setItem("token", data.token);
  return data;
};

export const registro = async (usuario) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
};

export const logout = () => {
  localStorage.removeItem("token");
};
