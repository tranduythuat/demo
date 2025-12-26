const TOTAL_ITEMS = window.innerWidth < 768 ? 20 : 30

const IMAGES = [
  "../assets/images/flower01.png",
  "../assets/images/flower02.png",
  "../assets/images/flower03.png",
  "../assets/images/leaf01.png",
]

const scene = document.querySelector(".scene")
const random = gsap.utils.random

// 🌬️ Gió cố định 1 hướng (chuẩn cinematic)
const WIND_DIRECTION = 1 // 1: sang phải | -1: sang trái
const WIND_STRENGTH = random(120, 200)

function createItem() {
  const el = document.createElement("div")
  el.className = "leaf"

  el.style.backgroundImage =
    `url(${IMAGES[Math.floor(Math.random() * IMAGES.length)]})`

  const depth = random(0.7, 1)

  const startX = random(-150, window.innerWidth + 150)
  const startY = random(-200, -50)

  gsap.set(el, {
    x: startX,
    y: startY,
    scale: depth,
    opacity: depth,
    rotationX: random(-60, 60),
    rotationY: random(-180, 180),
    filter: `blur(${(1 - depth) * 2}px)`
  })

  scene.appendChild(el)
  animateFall(el, depth)
}


function animateFall(el, depth) {
  const duration = gsap.utils.mapRange(0.3, 1, 12, depth)

  // 🔥 nghiêng mạnh hơn
  const driftX =
    WIND_STRENGTH * WIND_DIRECTION * (1.4 + depth) +
    random(-40, 40)

  gsap.to(el, {
    y: window.innerHeight + 200,
    x: `+=${driftX * 1.2}`,

    // 🌪️ xoay quanh trục, KHÔNG quay tròn
    rotationY: `+=${random(120, 360) * depth}`,

    rotationX: `+=${random(-120, 120)}`,
    rotationZ: WIND_DIRECTION * -15,
    duration,
    ease: "none",

    onComplete: () => {
      el.remove()
      createItem()
    }
  })
}
// Init
for (let i = 0; i < TOTAL_ITEMS; i++) {
  setTimeout(createItem, i * 300)
}

// Resize cleanup
window.addEventListener("resize", () => {
  document.querySelectorAll(".leaf").forEach(el => el.remove())
})
