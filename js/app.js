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

function mostrarFrase() {
  const contenedor = document.getElementById("mensaje");
  if (!contenedor) return;

  contenedor.style.opacity = 0;

  setTimeout(() => {
    contenedor.innerHTML = `<em>"${frasesLocales[indiceActual]}"</em>`;
    contenedor.style.opacity = 1;

    indiceActual++;
    if (indiceActual >= frasesLocales.length) {
      indiceActual = 0;
    }
  }, 400);
}

function cambiarColorFondo() {
  const colores = [
    "#f4f1ea",
    "#ece7dc",
    "#e6dfd1",
    "#f8f6f1",
    "#ddd6c4"
  ];

  let nuevoColor;

  do {
    nuevoColor = colores[Math.floor(Math.random() * colores.length)];
  } while (nuevoColor === ultimoColor);

  document.body.style.backgroundColor = nuevoColor;
  ultimoColor = nuevoColor;
}

function activarVisorImagen() {
  const imagenes = document.querySelectorAll(".img-cartel");
  const visor = document.getElementById("visor");
  const imgGrande = document.getElementById("img-grande");
  const cerrar = document.querySelector(".cerrar");

  if (!imagenes.length || !visor || !imgGrande || !cerrar) return;

  imagenes.forEach((img) => {
    img.addEventListener("click", () => {
      visor.style.display = "block";
      imgGrande.src = img.src;
      imgGrande.alt = img.alt || "Imagen ampliada";
    });
  });

  cerrar.addEventListener("click", () => {
    visor.style.display = "none";
  });

  visor.addEventListener("click", (e) => {
    if (e.target === visor) {
      visor.style.display = "none";
    }
  });
}

function activarFormularioAspirante() {
  const formularioAspirante = document.getElementById("form-aspirante");
  if (!formularioAspirante) return;

  formularioAspirante.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof emailjs === "undefined") {
      alert("Error al enviar ❌");
      console.log("EmailJS no está cargado.");
      return;
    }

    emailjs
      .sendForm(
        "service_xwi1kcj",
        "template_iptsuwl",
        formularioAspirante
      )
      .then(function () {
        alert("Solicitud enviada correctamente ✅");
        formularioAspirante.reset();
      })
      .catch(function (error) {
        alert("Error al enviar ❌");
        console.log("ERROR EMAILJS:", error);
        console.log("STATUS:", error?.status);
        console.log("TEXT:", error?.text);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarFrase();
  setInterval(mostrarFrase, 7000);

  activarFormularioAspirante();
  activarVisorImagen();
});

setInterval(cambiarColorFondo, 8000);