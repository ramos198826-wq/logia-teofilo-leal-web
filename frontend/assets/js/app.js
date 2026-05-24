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

function activarHeroCinematico() {
  const heroBg = document.querySelector(".hero-bg");
  const heroContent = document.querySelector(".hero-radical-content");
  const scrollIndicator = document.querySelector(".hero-scroll-indicator");
  const hero = document.querySelector(".hero-radical");

  if (!heroBg || !hero) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        // Parallax: fondo se mueve a 0.38× la velocidad del scroll (ilusión de profundidad)
        heroBg.style.transform = `translateY(${scrollY * 0.38}px)`;

        // El contenido se desvanece suavemente al scrollear
        if (heroContent) {
          const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
          heroContent.style.opacity = 1 - progress * 0.65;
          heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
        }

        // El indicador de scroll se oculta al primer desplazamiento
        if (scrollIndicator) {
          scrollIndicator.classList.toggle("oculto", scrollY > 50);
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  activarMensajeBienvenida();
  activarFormularioAspirante();
  activarNavbarSticky();
  activarCarruselCartelera();
  activarAnimacionesScroll();
  activarHeroCinematico();
});