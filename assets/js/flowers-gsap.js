const TOTAL_ITEMS = window.innerWidth < 768 ? 30 : 50

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
const spinFns = new Map()
const wind = {
  base: gsap.utils.random(120, 160),
  gust: 0,
  value: 0,
  phase: Math.random() * Math.PI * 2
}

let scrolling
window.addEventListener("scroll", () => {
  document.body.classList.add("scrolling")
  clearTimeout(scrolling)
  scrolling = setTimeout(() => {
    document.body.classList.remove("scrolling")
  }, 150)
})

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
    filter: `blur(${(1 - depth) * 1.5}px)`
  })

  scene.appendChild(el)
  animateFall(el, depth)
}


function animateFall(el, depth) {
  const fallDuration = gsap.utils.mapRange(0.3, 1, 24, 12, depth)
  const spinDuration = gsap.utils.mapRange(4, 5, 3)
  const getSceneHeight = () =>
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  // nghiêng mạnh
  const driftX =
    WIND_STRENGTH * WIND_DIRECTION * (1.4 + depth) +
    random(-40, 40)

  // ⬇️ rơi chính
  gsap.to(el, {
    y: window.innerHeight + 200,
    x: `+=${driftX}`,
    duration: fallDuration,
    ease: "none",
    onComplete: () => {
      const spinFn = spinFns.get(el)
      if (spinFn) {
        gsap.ticker.remove(spinFn)
        spinFns.delete(el)
      }

      el.remove()
      createItem()
    }
  })

  startSpin(el, depth)
}

function startSpin(el, depth) {
  // 🔥 tăng base speed
  const depthFactor = gsap.utils.mapRange(0.3, 1, 0.6, 1.2, depth)
const baseSpeedY = random(1.5, 3) * depthFactor
  // const baseSpeedY = gsap.utils.random(2.5, 4.5) * depth
  const baseSpeedX = gsap.utils.random(-3, 3) * depth

  let ry = gsap.getProperty(el, "rotationY")
  let rx = gsap.getProperty(el, "rotationX")

  const spinFn = () => {
    // gió càng mạnh → quay càng nhanh
    // const windFactor = 1 + Math.abs(wind.gust) / 60
    const windFactor = 1 + Math.abs(wind.gust) / 40

    ry += baseSpeedY * windFactor
    rx += baseSpeedX * windFactor

    gsap.set(el, {
      rotationY: ry,
      rotationX: rx
    })
  }

  spinFns.set(el, spinFn)
  gsap.ticker.add(spinFn)
}

// Init
for (let i = 0; i < TOTAL_ITEMS; i++) {
  setTimeout(createItem, i * 300)
}

// Resize cleanup
window.addEventListener("resize", () => {
  document.querySelectorAll(".leaf").forEach(el => el.remove())
})
