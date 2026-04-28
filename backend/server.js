const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Ruta del archivo aspirantes.json
const archivoAspirantes = path.join(__dirname, "aspirantes.json");

// CORS - DEBE estar antes de cualquier otra ruta o middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  
  // Manejar preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.post("/api/aspirantes", (req, res) => {
  const data = req.body;

  console.log("Datos recibidos:", data);

  // ✅ VALIDACIÓN 1: Campos obligatorios
  const camposObligatorios = ["nombre", "edad", "telefono", "email", "descripcion"];
  const faltanCampos = camposObligatorios.some(campo => !data[campo] || data[campo].trim() === "");
  
  if (faltanCampos) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios"
    });
  }

  // ✅ LECTURA DEL ARCHIVO CON PROTECCIÓN
  // Si aspirantes.json existe pero JSON está corrupto, detener inmediatamente
  let aspirantes = [];
  if (fs.existsSync(archivoAspirantes)) {
    try {
      const contenido = fs.readFileSync(archivoAspirantes, "utf-8");
      aspirantes = JSON.parse(contenido);
    } catch (error) {
      console.log("Error al parsear aspirantes.json:", error.message);
      return res.status(500).json({
        message: "Error interno al leer los datos. No se guardó la solicitud."
      });
    }
  }

  // ✅ VALIDACIÓN 2: Email duplicado
  const emailNormalizado = data.email.trim().toLowerCase();
  const emailExiste = aspirantes.some(aspirante => 
    aspirante.email.trim().toLowerCase() === emailNormalizado
  );
  
  if (emailExiste) {
    return res.status(400).json({
      message: "Este correo ya está registrado"
    });
  }

  // ✅ VALIDACIÓN 3: Teléfono duplicado
  const telefonoNormalizado = data.telefono.trim();
  const telefonoExiste = aspirantes.some(aspirante => 
    aspirante.telefono.trim() === telefonoNormalizado
  );
  
  if (telefonoExiste) {
    return res.status(400).json({
      message: "Este teléfono ya está registrado"
    });
  }

  // ✅ Si todas las validaciones pasaron: Crear nuevo registro con datos limpios
  const nuevoRegistro = {
    ...data,
    email: emailNormalizado,
    telefono: telefonoNormalizado,
    timestamp: new Date().toISOString(),
    id: aspirantes.length + 1
  };

  // Agregar el nuevo registro
  aspirantes.push(nuevoRegistro);

  // Guardar en archivo
  try {
    fs.writeFileSync(archivoAspirantes, JSON.stringify(aspirantes, null, 2), "utf-8");
    console.log("Registro guardado en aspirantes.json");

    // Responder con éxito
    res.json({
      message: "Solicitud recibida correctamente",
      data: data
    });
  } catch (error) {
    console.log("Error al guardar en aspirantes.json:", error.message);
    
    // Responder con error
    res.status(500).json({
      message: "Error al guardar los datos",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});