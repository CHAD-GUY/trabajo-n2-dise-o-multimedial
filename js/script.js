let galaxy = [];
let dustClouds = [];
let centerCore = [];
let mouseInfluence = { x: 0, y: 0, strength: 0 };
let backgroundStars = [];
let galaxyRotation = { x: 0, y: 0, z: 0 };
let cameraPosition = { x: 0, y: 0, z: 600 };

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("p5-container");

  createImmediateStars();

  createGalaxy();

  createCenterCore();

  createDustClouds();

  createBackgroundStars();
}

function createImmediateStars() {
  for (let i = 0; i < 12; i++) {
    let zone = i % 4;
    let x, y;

    switch (zone) {
      case 0:
        x = random(-100, 100);
        y = random(-100, 100);
        break;
      case 1:
        x = random(-400, -150);
        y = random(-200, 200);
        break;
      case 2:
        x = random(150, 400);
        y = random(-200, 200);
        break;
      case 3:
        x = random(-200, 200);
        y = random(-300, -150) * (i % 2 === 0 ? 1 : -1);
        break;
    }

    centerCore.push({
      x: x,
      y: y,
      z: random(-20, 20),
      size: random(3, 6),
      brightness: 255,
      grayTone: 255,
      pulseSpeed: random(0.01, 0.03),
      pulseOffset: random(TWO_PI),
      isCore: true,
      immediate: true,
    });
  }
}

function createGalaxy() {
  const arms = 4;
  const starsPerArm = 60;

  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < starsPerArm; i++) {
      let progress = i / starsPerArm;
      let angle = (arm * TWO_PI) / arms + progress * PI * 6;
      let radius = progress * 400 + random(-50, 50);

      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = random(-100, 100) + sin(progress * PI * 2) * 30;

      let centerDistance = sqrt(x * x + y * y);
      let brightnessBoost = centerDistance < 150 ? 255 : random(180, 255);
      let sizeBoost = centerDistance < 100 ? random(2, 6) : random(1, 4);

      galaxy.push({
        x: x,
        y: y,
        z: z,
        originalX: x,
        originalY: y,
        originalZ: z,
        size: sizeBoost,
        brightness: brightnessBoost,
        grayTone: 255,
        pulseSpeed: random(0.005, 0.02),
        pulseOffset: random(TWO_PI),
        armIndex: arm,
        distanceFromCenter: radius,
      });
    }
  }

  for (let i = 0; i < 10; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 350);

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = random(-50, 50);

    galaxy.push({
      x: x,
      y: y,
      z: z,
      originalX: x,
      originalY: y,
      originalZ: z,
      size: random(2, 4),
      brightness: 255,
      grayTone: 255,
      pulseSpeed: random(0.005, 0.02),
      pulseOffset: random(TWO_PI),
      armIndex: 0,
      distanceFromCenter: radius,
      immediate: true,
    });
  }
}

function createCenterCore() {
  for (let i = 0; i < 15; i++) {
    let angle = random(TWO_PI);
    let ring = i % 3;
    let radius;

    switch (ring) {
      case 0:
        radius = random(20, 80);
        break;
      case 1:
        radius = random(100, 180);
        break;
      case 2:
        radius = random(200, 300);
        break;
    }

    centerCore.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: random(-30, 30),
      size: random(2, 5),
      brightness: 255,
      grayTone: 255,
      pulseSpeed: random(0.01, 0.03),
      pulseOffset: random(TWO_PI),
      isCore: true,
    });
  }
}

function createDustClouds() {
  for (let i = 0; i < 200; i++) {
    let angle = random(TWO_PI);
    let radius = random(100, 350);

    dustClouds.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: random(-150, 150),
      size: random(8, 20),
      opacity: random(0.15, 0.35),
      baseOpacity: random(0.15, 0.35),
      grayTone: random(150, 200),
      driftSpeed: random(0.001, 0.005),
      driftOffset: random(TWO_PI),
      variationSpeed: random(0.003, 0.008),
    });
  }
}

function createBackgroundStars() {
  for (let i = 0; i < 120; i++) {
    backgroundStars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1500, -400),
      size: random(0.8, 2.5),
      brightness: random(180, 255),
      twinkleSpeed: random(0.003, 0.015),
    });
  }
}

function draw() {
  clear();

  updateMouseInfluence();

  ambientLight(20);
  pointLight(255, 255, 200, 0, 0, 100);

  drawBackgroundStars();

  push();

  translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  rotateX(galaxyRotation.x);
  rotateY(galaxyRotation.y + frameCount * 0.002);
  rotateZ(galaxyRotation.z);

  drawDustClouds();

  drawGalaxy();

  drawCenterCore();

  pop();
}

function updateMouseInfluence() {
  let targetRotX = map(mouseY, 0, height, -0.3, 0.3);
  let targetRotZ = map(mouseX, 0, width, -0.2, 0.2);

  let targetCamX = map(mouseX, 0, width, -100, 100);
  let targetCamY = map(mouseY, 0, height, 100, -100);

  galaxyRotation.x = lerp(galaxyRotation.x, targetRotX, 0.02);
  galaxyRotation.z = lerp(galaxyRotation.z, targetRotZ, 0.02);

  cameraPosition.x = lerp(cameraPosition.x, targetCamX, 0.01);
  cameraPosition.y = lerp(cameraPosition.y, targetCamY, 0.01);

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

    let drift = sin(frameCount * cloud.driftSpeed + cloud.driftOffset) * 10;
    translate(cloud.x + drift, cloud.y, cloud.z);

    let opacityVariation =
      sin(frameCount * cloud.variationSpeed + cloud.driftOffset) * 0.1 + 0.9;
    let finalOpacity = cloud.baseOpacity * opacityVariation;

    fill(cloud.grayTone, cloud.grayTone, cloud.grayTone, finalOpacity * 255);
    noStroke();
    sphere(cloud.size);

    pop();
  }
}

function drawGalaxy() {
  for (let star of galaxy) {
    push();

    let mouseEffect = mouseInfluence.strength * 0.3;
    let offsetX =
      star.originalX +
      sin(frameCount * 0.01 + star.armIndex) * mouseEffect * 20;
    let offsetY =
      star.originalY +
      cos(frameCount * 0.01 + star.armIndex) * mouseEffect * 20;

    translate(offsetX, offsetY, star.z);

    let pulse =
      sin(frameCount * star.pulseSpeed + star.pulseOffset) * 0.4 + 0.8;
    let currentSize = star.size * pulse;

    let grayValue = star.grayTone * pulse;
    fill(grayValue, grayValue, grayValue, star.brightness * pulse);

    noStroke();
    sphere(currentSize);

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

    let pulse =
      sin(frameCount * core.pulseSpeed + core.pulseOffset) * 0.6 + 0.8;
    let currentSize = core.size * pulse;

    let coreGray = core.grayTone * pulse;
    fill(coreGray, coreGray, coreGray, core.brightness * pulse);
    noStroke();
    sphere(currentSize);

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

document.addEventListener("DOMContentLoaded", function () {
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

  function handleHeaderScroll() {
    const header = document.getElementById("header");
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  function handleParallax() {
    const scrolled = window.pageYOffset;
    const canvas = document.getElementById("p5-container");
    if (canvas) {
      canvas.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  window.addEventListener("scroll", () => {
    handleScrollAnimations();
    handleHeaderScroll();
    handleParallax();
  });

  handleScrollAnimations();

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

  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
