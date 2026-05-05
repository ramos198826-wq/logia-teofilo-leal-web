const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Ruta del archivo aspirantes.json
const archivoAspirantes = path.join(__dirname, "data", "aspirantes.json");

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "12345") {
    return res.json({
      message: "Login correcto",
      autorizado: true
    });
  }

  res.status(401).json({
    message: "Usuario o contraseña incorrectos",
    autorizado: false
  });
});

// CREAR ASPIRANTE
app.post("/api/aspirantes", (req, res) => {
  const data = req.body;

  const camposObligatorios = ["nombre", "edad", "telefono", "email", "descripcion"];
  const faltanCampos = camposObligatorios.some(campo => !data[campo] || data[campo].trim() === "");

  if (faltanCampos) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  let aspirantes = [];

  if (fs.existsSync(archivoAspirantes)) {
    try {
      const contenido = fs.readFileSync(archivoAspirantes, "utf-8");
      aspirantes = JSON.parse(contenido);
    } catch {
      return res.status(500).json({ message: "Error al leer los datos" });
    }
  }

  const emailNormalizado = data.email.trim().toLowerCase();
  const telefonoNormalizado = data.telefono.trim();

  if (aspirantes.some(a => a.email.toLowerCase() === emailNormalizado)) {
    return res.status(400).json({ message: "Correo ya registrado" });
  }

  if (aspirantes.some(a => a.telefono === telefonoNormalizado)) {
    return res.status(400).json({ message: "Teléfono ya registrado" });
  }

  const fechaActual = new Date().toISOString();

  const nuevoRegistro = {
    ...data,
    email: emailNormalizado,
    telefono: telefonoNormalizado,
    estado: "Nuevo",
    timestamp: fechaActual,
    id: aspirantes.length + 1,
    historialEstados: [
      {
        estado: "Nuevo",
        fecha: fechaActual,
        nota: "Solicitud registrada"
      }
    ]
  };

  aspirantes.push(nuevoRegistro);

  fs.writeFileSync(archivoAspirantes, JSON.stringify(aspirantes, null, 2));

  res.json({ message: "Solicitud guardada" });
});

// OBTENER ASPIRANTES
app.get("/api/aspirantes", (req, res) => {
  try {
    if (!fs.existsSync(archivoAspirantes)) return res.json([]);

    const contenido = fs.readFileSync(archivoAspirantes, "utf-8");
    res.json(JSON.parse(contenido));
  } catch {
    res.status(500).json({ message: "Error al cargar aspirantes" });
  }
});

// ACTUALIZAR ESTADO
app.put("/api/aspirantes/:id/estado", (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  const estadosPermitidos = ["Nuevo", "Contactado", "En proceso", "Aprobado", "Rechazado"];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  const aspirantes = JSON.parse(fs.readFileSync(archivoAspirantes, "utf-8"));
  const aspirante = aspirantes.find(a => a.id === id);

  if (!aspirante) return res.status(404).json({ message: "No encontrado" });

  // actualizar estado
  aspirante.estado = estado;

  // asegurar historial
  if (!aspirante.historialEstados) {
    aspirante.historialEstados = [];
  }

  // guardar en historial
  aspirante.historialEstados.push({
    estado,
    fecha: new Date().toISOString(),
    nota: "Estado actualizado desde el panel"
  });

  fs.writeFileSync(archivoAspirantes, JSON.stringify(aspirantes, null, 2));

  res.json({ message: "Estado actualizado" });
});

// ELIMINAR
app.delete("/api/aspirantes/:id", (req, res) => {
  const id = Number(req.params.id);

  const aspirantes = JSON.parse(fs.readFileSync(archivoAspirantes, "utf-8"));
  const nuevos = aspirantes.filter(a => a.id !== id);

  fs.writeFileSync(archivoAspirantes, JSON.stringify(nuevos, null, 2));

  res.json({ message: "Eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});