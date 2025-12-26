const TOTAL_ITEMS = window.innerWidth < 768 ? 15 : 30

// Ảnh lá / hoa
const IMAGES = [
    "../assets/images/flower01.png",
    "../assets/images/flower02.png",
    "../assets/images/flower03.png",
    "../assets/images/leaf01.png",
]

const scene = document.querySelector(".scene")

// Gió
let windDirection = 1
let windStrength = 120

// Đổi chiều gió theo thời gian
setInterval(() => {
  windDirection *= -1
  windStrength = gsap.utils.random(80, 160)
}, 6000)

// Helpers
const random = gsap.utils.random

function createItem() {
  const el = document.createElement("div")
  el.className = "leaf"

  el.style.backgroundImage =
    `url(${IMAGES[Math.floor(Math.random() * IMAGES.length)]})`

  const startX = random(0, window.innerWidth)
  const startY = random(-150, -50)
  const scale = random(0.6, 1.2)
  const opacity = random(0.6, 0.95)

  gsap.set(el, {
    x: startX,
    y: startY,
    scale,
    opacity,
    rotation: random(0, 360)
  })

  scene.appendChild(el)

  animateFall(el)
}

function animateFall(el) {
  const fallDuration = random(10, 18)
  const swayAmplitude = random(60, 140)
  const rotateAmount = random(-180, 180)

  // Rơi chính (theo gió)
  gsap.to(el, {
    y: window.innerHeight + 150,
    x: `+=${windStrength * windDirection}`,
    rotation: rotateAmount,
    duration: fallDuration,
    ease: "none",
    onComplete: () => {
      el.remove()
      createItem()
    }
  })

  // Lắc + trôi sin (chuyển động tự nhiên)
  gsap.to(el, {
    x: `+=${swayAmplitude * windDirection}`,
    rotation: `+=${random(-40, 40)}`,
    duration: random(2, 4),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  })
}

// Init
for (let i = 0; i < TOTAL_ITEMS; i++) {
  setTimeout(createItem, i * 300)
}

// Resize fix
window.addEventListener("resize", () => {
  document.querySelectorAll(".leaf").forEach(el => el.remove())
})
