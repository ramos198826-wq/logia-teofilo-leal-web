const frasesLocales = [
  "La verdadera sabiduría comienza con el dominio de uno mismo.",
  "El trabajo constante pule la piedra bruta del ser humano.",
  "La fraternidad une lo que el ego separa.",
  "La luz se encuentra en la búsqueda sincera de la verdad.",
  "Cada paso con disciplina fortalece el templo interior.",
  "La verdad se honra con obras, no solo con palabras.",
  "El estudio y la rectitud elevan el carácter del hombre."
];

let indiceActual = 0;
let ultimoColor = "";

function activarFormularioAspirante() {
  const formularioAspirante = document.getElementById("form-aspirante");
  const mensajeFormulario = document.getElementById("mensaje-formulario");

  if (!formularioAspirante || !mensajeFormulario) return;

  function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = "";

    mensajeFormulario.style.display = "block";
    mensajeFormulario.style.textAlign = "center";
    mensajeFormulario.style.margin = "15px auto";
    mensajeFormulario.style.padding = "12px";
    mensajeFormulario.style.borderRadius = "8px";
    mensajeFormulario.style.fontSize = "16px";
    mensajeFormulario.style.fontWeight = "bold";
    mensajeFormulario.style.opacity = "1";

    if (tipo === "exito") {
      mensajeFormulario.classList.add("mostrar", "exito");
      mensajeFormulario.style.color = "#0a7a28";
      mensajeFormulario.style.backgroundColor = "#e8f8ee";
      mensajeFormulario.style.border = "1px solid #0a7a28";
    } else if (tipo === "error") {
      mensajeFormulario.classList.add("mostrar", "error");
      mensajeFormulario.style.color = "#b00020";
      mensajeFormulario.style.backgroundColor = "#fdecec";
      mensajeFormulario.style.border = "1px solid #b00020";
    } else {
      mensajeFormulario.classList.add("mostrar");
      mensajeFormulario.style.color = "#1e2a44";
      mensajeFormulario.style.backgroundColor = "#f4f1ea";
      mensajeFormulario.style.border = "1px solid #d4af37";
    }
  // ⏱️ Desaparece después de 3 segundos
setTimeout(() => {
  mensajeFormulario.style.opacity = "0";
  mensajeFormulario.className = "";

  // opcional: limpiar texto después de desaparecer
  setTimeout(() => {
    mensajeFormulario.textContent = "";
  }, 300);
}, 3000);
  
  
  }

  formularioAspirante.addEventListener("submit", async function (e) {
    e.preventDefault();

    mostrarMensaje("Enviando solicitud...", "info");

    const formData = new FormData(formularioAspirante);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/aspirantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        mostrarMensaje(result.message || "Error al enviar la solicitud ❌", "error");
        return;
      }

      formularioAspirante.reset();
      mostrarMensaje("Solicitud enviada correctamente ✅", "exito");

      console.log("Respuesta del backend:", result);

    } catch (error) {
      mostrarMensaje("Error de conexión con el servidor ❌", "error");
      console.log("ERROR BACKEND:", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  activarFormularioAspirante();
});