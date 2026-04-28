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
  if (!formularioAspirante) return;

  formularioAspirante.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(formularioAspirante);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/api/aspirantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      alert("Solicitud enviada correctamente ✅");
      console.log("Respuesta del backend:", result);

      formularioAspirante.reset();
    } catch (error) {
      alert("Error al enviar ❌");
      console.log("ERROR BACKEND:", error);
    }
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  activarFormularioAspirante();
});