// Galaxy animation variables
let galaxy = [];
let dustClouds = [];
let centerCore = [];
let mouseInfluence = { x: 0, y: 0, strength: 0 };
let backgroundStars = [];
let galaxyRotation = { x: 0, y: 0, z: 0 };
let cameraPosition = { x: 0, y: 0, z: 800 };

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("p5-container");

  // Crear galaxia espiral
  createGalaxy();

  // Crear núcleo central
  createCenterCore();

  // Crear nubes de polvo cósmico
  createDustClouds();

  // Crear estrellas de fondo
  createBackgroundStars();
}

function createGalaxy() {
  const arms = 4; // Brazos espirales
  const starsPerArm = 80;

  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < starsPerArm; i++) {
      let progress = i / starsPerArm;
      let angle = (arm * TWO_PI) / arms + progress * PI * 6; // Espiral
      let radius = progress * 400 + random(-50, 50);

      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = random(-100, 100) + sin(progress * PI * 2) * 30;

      galaxy.push({
        x: x,
        y: y,
        z: z,
        originalX: x,
        originalY: y,
        originalZ: z,
        size: random(1, 4),
        brightness: random(80, 255),
        grayTone: random(120, 255), // Tono de gris específico
        pulseSpeed: random(0.005, 0.02),
        pulseOffset: random(TWO_PI),
        armIndex: arm,
        distanceFromCenter: radius,
      });
    }
  }
}

function createCenterCore() {
  // Núcleo central brillante
  for (let i = 0; i < 30; i++) {
    let angle = random(TWO_PI);
    let radius = random(0, 50);

    centerCore.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: random(-20, 20),
      size: random(2, 8),
      brightness: random(200, 255),
      grayTone: random(200, 255), // Núcleo más brillante en escala de grises
      pulseSpeed: random(0.01, 0.03),
      pulseOffset: random(TWO_PI),
      isCore: true,
    });
  }
}

function createDustClouds() {
  // Nubes de polvo entre los brazos
  for (let i = 0; i < 200; i++) {
    let angle = random(TWO_PI);
    let radius = random(100, 350);

    dustClouds.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: random(-150, 150),
      size: random(8, 20),
      opacity: random(0.15, 0.35), // Opacidad inicial más alta
      baseOpacity: random(0.15, 0.35), // Opacidad base para mantener consistencia
      grayTone: random(60, 120), // Tonos de gris oscuro para polvo
      driftSpeed: random(0.001, 0.005),
      driftOffset: random(TWO_PI),
      variationSpeed: random(0.003, 0.008), // Para variaciones sutiles de opacidad
    });
  }
}

function createBackgroundStars() {
  for (let i = 0; i < 300; i++) {
    backgroundStars.push({
      x: random(-width * 3, width * 3),
      y: random(-height * 3, height * 3),
      z: random(-2000, -500),
      size: random(0.5, 2),
      brightness: random(30, 120),
      twinkleSpeed: random(0.003, 0.015),
    });
  }
}

function draw() {
  clear();

  // Actualizar influencia del mouse
  updateMouseInfluence();

  // Iluminación dinámica
  ambientLight(20);
  pointLight(255, 255, 200, 0, 0, 100);

  // Dibujar estrellas de fondo
  drawBackgroundStars();

  push();

  // Posición de cámara dinámica basada en mouse
  translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  // Rotación de la galaxia
  rotateX(galaxyRotation.x);
  rotateY(galaxyRotation.y + frameCount * 0.002);
  rotateZ(galaxyRotation.z);

  // Dibujar nubes de polvo
  drawDustClouds();

  // Dibujar galaxia espiral
  drawGalaxy();

  // Dibujar núcleo central
  drawCenterCore();

  pop();
}

function updateMouseInfluence() {
  // Mapear mouse a rotación y posición de cámara
  let targetRotX = map(mouseY, 0, height, -0.3, 0.3);
  let targetRotZ = map(mouseX, 0, width, -0.2, 0.2);

  let targetCamX = map(mouseX, 0, width, -100, 100);
  let targetCamY = map(mouseY, 0, height, 100, -100);

  // Interpolación suave
  galaxyRotation.x = lerp(galaxyRotation.x, targetRotX, 0.02);
  galaxyRotation.z = lerp(galaxyRotation.z, targetRotZ, 0.02);

  cameraPosition.x = lerp(cameraPosition.x, targetCamX, 0.01);
  cameraPosition.y = lerp(cameraPosition.y, targetCamY, 0.01);

  // Fuerza de mouse para efectos dinámicos
  mouseInfluence.strength =
    dist(mouseX, mouseY, width / 2, height / 2) / (width / 2);
}

function drawBackgroundStars() {
  for (let star of backgroundStars) {
    push();
    translate(star.x, star.y, star.z);

    let twinkle = sin(frameCount * star.twinkleSpeed) * 0.4 + 0.6;
    fill(255, star.brightness * twinkle);
    noStroke();
    sphere(star.size);

    pop();
  }
}

function drawDustClouds() {
  for (let cloud of dustClouds) {
    push();

    // Deriva lenta
    let drift = sin(frameCount * cloud.driftSpeed + cloud.driftOffset) * 10;
    translate(cloud.x + drift, cloud.y, cloud.z);

    // Variación sutil de opacidad para que "respiren" las nubes
    let opacityVariation =
      sin(frameCount * cloud.variationSpeed + cloud.driftOffset) * 0.1 + 0.9;
    let finalOpacity = cloud.baseOpacity * opacityVariation;

    // Tonos de gris para polvo cósmico
    fill(cloud.grayTone, cloud.grayTone, cloud.grayTone, finalOpacity * 255);
    noStroke();
    sphere(cloud.size);

    pop();
  }
}

function drawGalaxy() {
  for (let star of galaxy) {
    push();

    // Efecto de mouse - atracción/repulsión
    let mouseEffect = mouseInfluence.strength * 0.3;
    let offsetX =
      star.originalX +
      sin(frameCount * 0.01 + star.armIndex) * mouseEffect * 20;
    let offsetY =
      star.originalY +
      cos(frameCount * 0.01 + star.armIndex) * mouseEffect * 20;

    translate(offsetX, offsetY, star.z);

    // Pulsación
    let pulse =
      sin(frameCount * star.pulseSpeed + star.pulseOffset) * 0.4 + 0.8;
    let currentSize = star.size * pulse;

    // Tonos de gris según la distancia del centro
    let grayValue = star.grayTone * pulse;
    fill(grayValue, grayValue, grayValue, star.brightness * pulse);

    noStroke();
    sphere(currentSize);

    // Halo para estrellas más brillantes
    if (star.brightness > 200) {
      let haloGray = grayValue * 0.8;
      fill(haloGray, haloGray, haloGray, star.brightness * pulse * 0.1);
      sphere(currentSize * 4);
    }

    pop();
  }
}

function drawCenterCore() {
  for (let core of centerCore) {
    push();
    translate(core.x, core.y, core.z);

    // Pulsación intensa del núcleo
    let pulse =
      sin(frameCount * core.pulseSpeed + core.pulseOffset) * 0.6 + 0.8;
    let currentSize = core.size * pulse;

    // Blanco brillante para el núcleo
    let coreGray = core.grayTone * pulse;
    fill(coreGray, coreGray, coreGray, core.brightness * pulse);
    noStroke();
    sphere(currentSize);

    // Múltiples halos en escala de grises
    let halo1 = coreGray * 0.8;
    fill(halo1, halo1, halo1, core.brightness * pulse * 0.3);
    sphere(currentSize * 2);

    let halo2 = coreGray * 0.6;
    fill(halo2, halo2, halo2, core.brightness * pulse * 0.1);
    sphere(currentSize * 4);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  galaxy = [];
  centerCore = [];
  dustClouds = [];
  backgroundStars = [];
  createGalaxy();
  createCenterCore();
  createDustClouds();
  createBackgroundStars();
}

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Scroll animations
  function handleScrollAnimations() {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("visible");
      }
    });
  }

  // Header scroll effect
  function handleHeaderScroll() {
    const header = document.getElementById("header");
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Parallax effect
  function handleParallax() {
    const scrolled = window.pageYOffset;
    const canvas = document.getElementById("p5-container");
    if (canvas) {
      canvas.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  // Event listeners
  window.addEventListener("scroll", () => {
    handleScrollAnimations();
    handleHeaderScroll();
    handleParallax();
  });

  // Initial scroll check
  handleScrollAnimations();

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Enhanced service card interactions
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Team card hover effects
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
