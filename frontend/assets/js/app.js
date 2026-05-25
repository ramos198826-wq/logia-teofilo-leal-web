const frasesLocales = [
  "La verdadera sabiduría comienza con el dominio de uno mismo.",
  "El trabajo constante pule la piedra bruta del ser humano.",
  "La fraternidad une lo que el ego separa.",
  "La luz se encuentra en la búsqueda sincera de la verdad.",
  "Cada paso con disciplina fortalece el templo interior.",
  "La verdad se honra con obras, no solo con palabras.",
  "El estudio y la rectitud eleva el carácter del hombre."
];

function activarMensajeBienvenida() {
  const mensaje = document.getElementById("mensaje");
  if (!mensaje) return;

  const indice = Math.floor(Math.random() * frasesLocales.length);
  mensaje.innerHTML = `<em>${frasesLocales[indice]}</em>`;
}

function activarFormularioAspirante() {
  const formulario = document.getElementById("form-aspirante");
  const mensajeFormulario = document.getElementById("mensaje-formulario");

  if (!formulario || !mensajeFormulario) return;

  function mostrarMensaje(texto, tipo = "info") {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = "";
    mensajeFormulario.classList.add("mostrar", tipo);

    mensajeFormulario.style.display = "block";
    mensajeFormulario.style.opacity = "1";

    setTimeout(() => {
      mensajeFormulario.style.opacity = "0";

      setTimeout(() => {
        mensajeFormulario.textContent = "";
        mensajeFormulario.className = "";
      }, 300);
    }, 3000);
  }

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    mostrarMensaje("Enviando solicitud...", "info");

    const formData = new FormData(formulario);
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

      formulario.reset();
      mostrarMensaje("Solicitud enviada correctamente ✅", "exito");

      console.log("Respuesta del backend:", result);
    } catch (error) {
      mostrarMensaje("Error de conexión con el servidor ❌", "error");
      console.log("ERROR BACKEND:", error);
    }
  });
}

function activarNavbarSticky() {
  const nav = document.querySelector(".nav-stitch");
  if (!nav) return;

  function manejarScroll() {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  manejarScroll();
  window.addEventListener("scroll", manejarScroll);
}

function activarCarruselCartelera() {
  const track = document.getElementById("cartelera-track");
  const btnPrev = document.getElementById("btn-cartelera-prev");
  const btnNext = document.getElementById("btn-cartelera-next");

  if (!track || !btnPrev || !btnNext) return;

  const totalItems = track.children.length;
  let posicion = 0;
  let autoplay;

  function obtenerVisibles() {
    return window.innerWidth <= 900 ? 1 : 3;
  }

  function obtenerAnchoItem() {
    const item = track.children[0];
    const gap = 28;
    return item.offsetWidth + gap;
  }

  function moverCarrusel() {
    const visibles = obtenerVisibles();
    const maxPosicion = totalItems - visibles;

    if (posicion > maxPosicion) posicion = 0;
    if (posicion < 0) posicion = maxPosicion;

    track.style.transform = `translateX(-${posicion * obtenerAnchoItem()}px)`;
  }

  btnNext.addEventListener("click", () => {
    posicion++;
    moverCarrusel();
  });

  btnPrev.addEventListener("click", () => {
    posicion--;
    moverCarrusel();
  });

  function iniciarAutoplay() {
    detenerAutoplay();
    autoplay = setInterval(() => {
      posicion++;
      moverCarrusel();
    }, 5000);
  }

  function detenerAutoplay() {
    if (autoplay) clearInterval(autoplay);
  }

  track.addEventListener("mouseenter", detenerAutoplay);
  track.addEventListener("mouseleave", iniciarAutoplay);

  window.addEventListener("resize", moverCarrusel);

  moverCarrusel();
  iniciarAutoplay();
}

function activarAnimacionesScroll() {
  const secciones = document.querySelectorAll(".fade-in-section");
  if (!secciones.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  secciones.forEach((section) => observer.observe(section));
}

function clamp(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

function smoothStep(borde0, borde1, valor) {
  const x = clamp((valor - borde0) / (borde1 - borde0), 0, 1);
  return x * x * (3 - 2 * x);
}

function activarHeroScrollStory() {
  const storyHero    = document.querySelector(".story-hero");
  const frames       = document.querySelectorAll(".story-frame");
  const copies       = document.querySelectorAll(".scene-copy");
  const currentScene = document.querySelector("#currentScene");
  const counterProg  = document.querySelector(".counter-progress");
  const goldenPulse  = document.querySelector(".golden-pulse");
  const scrollHint   = document.querySelector(".scroll-hint");

  const totalEscenas = frames.length;
  let isTicking = false;

  if (!storyHero || !totalEscenas) return;

  function actualizar() {
    const rect        = storyHero.getBoundingClientRect();
    const totalScroll = storyHero.offsetHeight - window.innerHeight;
    const progress    = clamp(-rect.top / totalScroll, 0, 1);

    const longEscena   = 1 / totalEscenas;
    const indiceActivo = clamp(Math.floor(progress / longEscena), 0, totalEscenas - 1);

    frames.forEach((frame, i) => {
      const inicio   = i * longEscena;
      const fin      = inicio + longEscena;
      const fadeIn   = smoothStep(inicio, inicio + longEscena * 0.22, progress);
      const fadeOut  = 1 - smoothStep(fin - longEscena * 0.22, fin, progress);
      const opacidad = clamp(fadeIn * fadeOut, 0, 1);
      const local    = clamp((progress - inicio) / longEscena, 0, 1);

      frame.classList.toggle("active", i === indiceActivo);
      frame.style.opacity   = opacidad;
      frame.style.transform = `scale(${1.045 - local * 0.035})`;
      frame.style.filter    = `brightness(${0.94 + local * 0.08}) contrast(1.06) saturate(${1.04 + local * 0.04})`;
    });

    copies.forEach((copy, i) => {
      const inicio   = i * longEscena;
      const fin      = inicio + longEscena;
      const textIn   = smoothStep(inicio + longEscena * 0.18, inicio + longEscena * 0.34, progress);
      const textOut  = 1 - smoothStep(fin - longEscena * 0.34, fin - longEscena * 0.16, progress);
      const opacidad = clamp(textIn * textOut, 0, 1);

      copy.classList.toggle("active", i === indiceActivo);
      copy.style.opacity       = opacidad;
      copy.style.pointerEvents = opacidad > 0.75 ? "auto" : "none";
      copy.style.transform     = `translateY(${-44 + opacidad * -6}%)`;
    });

    if (currentScene) currentScene.textContent = String(indiceActivo + 1).padStart(2, "0");
    if (counterProg)  counterProg.style.width  = `${progress * 100}%`;

    const luz = smoothStep(0.48, 0.9, progress);
    if (goldenPulse) {
      goldenPulse.style.opacity   = luz * 0.75;
      goldenPulse.style.transform = `scale(${0.95 + luz * 0.18})`;
    }

    if (scrollHint) scrollHint.style.opacity = 1 - smoothStep(0.02, 0.12, progress);

    isTicking = false;
  }

  function solicitarActualizacion() {
    if (isTicking) return;
    isTicking = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener("scroll", solicitarActualizacion, { passive: true });
  window.addEventListener("resize", solicitarActualizacion);

  actualizar();
}

document.addEventListener("DOMContentLoaded", () => {
  activarMensajeBienvenida();
  activarFormularioAspirante();
  activarNavbarSticky();
  activarCarruselCartelera();
  activarAnimacionesScroll();
  activarHeroScrollStory();
});