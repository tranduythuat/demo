// const canvas = document.getElementById("flowerCanvas")
// const ctx = canvas.getContext("2d")

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

// // ================= CONFIG =================
// const TOTAL_FLOWERS = window.innerWidth < 768 ? 25 : 45
// const WIND_DIRECTION = 1          // 1 = sang phải, -1 = sang trái
// const WIND_FORCE = 0.3            // độ nghiêng gió
// const BASE_FALL_SPEED = 0.4
// // =========================================

// // Load ảnh
// const images = []
// const imageSources = [
//     "../assets/images/flower01.png",
//     "../assets/images/flower02.png",
//     "../assets/images/flower03.png",
//     "../assets/images/leaf01.png",
// ]

// imageSources.forEach(src => {
//   const img = new Image()
//   img.src = src
//   images.push(img)
// })

// function random(min, max) {
//   return Math.random() * (max - min) + min
// }

// class Flower {
//   constructor() {
//     this.reset(true)
//   }

//   reset(initial = false) {
//     this.x = random(0, canvas.width)
//     this.y = initial ? random(0, canvas.height) : random(-200, -50)

//     this.depth = random(0.2, 1) // xa → gần

//     this.scale = this.depth
//     this.alpha = this.depth
//     this.blur = (1 - this.depth) * 4

//     this.speedY = BASE_FALL_SPEED + this.depth * 1.2
//     this.speedX = WIND_FORCE * this.depth * WIND_DIRECTION

//     this.rotation = random(0, Math.PI * 2)
//     this.rotationSpeed = random(0.002, 0.01) * WIND_DIRECTION

//     this.image = images[Math.floor(Math.random() * images.length)]
//     this.size = random(24, 36)
//   }

//   update() {
//     this.y += this.speedY
//     this.x += this.speedX
//     this.rotation += this.rotationSpeed

//     if (this.y > canvas.height + 100) {
//       this.reset()
//     }
//   }

//   draw() {
//     ctx.save()

//     ctx.globalAlpha = this.alpha
//     ctx.filter = `blur(${this.blur}px)`

//     ctx.translate(this.x, this.y)
//     ctx.rotate(this.rotation)
//     ctx.scale(this.scale, this.scale)

//     ctx.drawImage(
//       this.image,
//       -this.size / 2,
//       -this.size / 2,
//       this.size,
//       this.size
//     )

//     ctx.restore()
//   }
// }

// // Init
// const flowers = []
// for (let i = 0; i < TOTAL_FLOWERS; i++) {
//   flowers.push(new Flower())
// }

// // Animation loop
// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height)

//   // Vẽ xa → gần (parallax đúng)
//   flowers
//     .sort((a, b) => a.depth - b.depth)
//     .forEach(flower => {
//       flower.update()
//       flower.draw()
//     })

//   requestAnimationFrame(animate)
// }

// animate()

// // Resize
// window.addEventListener("resize", () => {
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
// })



// =======================================================================

const layers = [
  { id: "far",  count: 10, blur: 4, speed: 0.4 },
  { id: "mid",  count: 15, blur: 2, speed: 0.7 },
  { id: "near", count: 20, blur: 0, speed: 1.1 }
]

const WIND_DIRECTION = 1
const WIND_FORCE = 0.25

const imageSources = [
      "../assets/images/flower01.png",
    "../assets/images/flower02.png",
    "../assets/images/flower03.png",
    "../assets/images/leaf01.png",
]

const images = imageSources.map(src => {
  const img = new Image()
  img.src = src
  return img
})

function random(min, max) {
  return Math.random() * (max - min) + min
}

class Flower {
  constructor(canvas, ctx, config) {
    this.canvas = canvas
    this.ctx = ctx
    this.config = config
    this.image = images[Math.floor(Math.random() * images.length)]
    this.reset(true)
  }

  reset(initial = false) {
    this.x = random(0, this.canvas.width)
    this.y = initial ? random(0, this.canvas.height) : random(-200, -50)

    this.size = random(22, 36)
    this.rotation = random(0, Math.PI * 2)
    this.rotationSpeed = random(0.002, 0.01)
  }

  update() {
    this.y += this.config.speed
    this.x += WIND_FORCE * WIND_DIRECTION
    this.rotation += this.rotationSpeed

    if (this.y > this.canvas.height + 100) {
      this.reset()
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.drawImage(
      this.image,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    )
    ctx.restore()
  }
}

const flowerGroups = []

layers.forEach(layer => {
  const canvas = document.getElementById(layer.id)
  const ctx = canvas.getContext("2d")

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.filter = layer.blur ? `blur(${layer.blur}px)` : "none"
  }

  resize()
  window.addEventListener("resize", resize)

  const flowers = []
  for (let i = 0; i < layer.count; i++) {
    flowers.push(new Flower(canvas, ctx, layer))
  }

  flowerGroups.push({ canvas, ctx, flowers })
})

function animate() {
  flowerGroups.forEach(group => {
    group.ctx.clearRect(
      0,
      0,
      group.canvas.width,
      group.canvas.height
    )

    group.flowers.forEach(flower => {
      flower.update()
      flower.draw()
    })
  })

  requestAnimationFrame(animate)
}

animate()
