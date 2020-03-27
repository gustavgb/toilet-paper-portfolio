window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height

  let unrolled = canvas.height / 3
  let rollVelocity = 0

  window.addEventListener('resize', function () {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  })

  function render () {
    setTimeout(render, 1000 / 60)

    const rollWidth = canvas.width * 0.25
    const rollLength = canvas.width * 50
    const rollX = canvas.width * 0.7
    const rollY = canvas.height * 0.4
    const paperLength = canvas.width / 3
    const lineWidth = canvas.width / 150

    unrolled += rollVelocity
    if (unrolled < 300) {
      unrolled = 300
    } else if (unrolled > rollLength) {
      unrolled = rollLength
    }

    rollVelocity *= 0.97
    if (Math.abs(rollVelocity) < 1) {
      rollVelocity = 0
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const innerRadius = rollWidth / 3
    const outerRadius = innerRadius + ((rollLength - unrolled) / (2 * Math.PI) * (rollWidth / 50000))
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'white'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    const angle = -(unrolled / (outerRadius * 2 * Math.PI)) * 2 * Math.PI
    ctx.moveTo(rollX + rollWidth / 2 - Math.abs(Math.cos(angle)) * innerRadius / 2, rollY + Math.sin(angle) * innerRadius)
    ctx.lineTo(rollX + rollWidth / 2 + Math.cos(angle) * innerRadius / 2, rollY + Math.sin(angle) * innerRadius)
    ctx.moveTo(rollX + rollWidth / 2 - Math.abs(Math.cos(angle + Math.PI)) * innerRadius / 2, rollY + Math.sin(angle + Math.PI) * innerRadius)
    ctx.lineTo(rollX + rollWidth / 2 + Math.cos(angle + Math.PI) * innerRadius / 2, rollY + Math.sin(angle + Math.PI) * innerRadius)
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(rollX - rollWidth / 2, rollY, outerRadius / 2, outerRadius, 0, 0, 2 * Math.PI)
    ctx.moveTo(rollX - rollWidth / 2, rollY - outerRadius)
    ctx.lineTo(rollX + rollWidth / 2, rollY - outerRadius)
    ctx.moveTo(rollX - rollWidth / 2, rollY + outerRadius)
    ctx.lineTo(rollX + rollWidth / 2, rollY + outerRadius)
    ctx.stroke()

    ctx.fillRect(rollX - rollWidth / 2, rollY - outerRadius + lineWidth / 2, outerRadius / 2 + lineWidth / 2, outerRadius * 2 - lineWidth)

    ctx.beginPath()
    ctx.ellipse(rollX + rollWidth / 2, rollY, innerRadius / 2, innerRadius, 0, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(rollX + rollWidth / 2, rollY, outerRadius / 2, outerRadius, 0, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.fillRect(rollX - rollWidth / 2 - outerRadius / 2 + lineWidth / 2, rollY, rollWidth - lineWidth, unrolled)

    ctx.beginPath()
    ctx.moveTo(rollX - rollWidth / 2 - outerRadius / 2, rollY)
    ctx.lineTo(rollX - rollWidth / 2 - outerRadius / 2, rollY + unrolled)
    ctx.lineTo(rollX + rollWidth / 2 - outerRadius / 2, rollY + unrolled)
    ctx.lineTo(rollX + rollWidth / 2 - outerRadius / 2, rollY)
    ctx.stroke()

    ctx.beginPath()
    ctx.setLineDash([10, 10])
    for (let i = (unrolled % paperLength) - paperLength; i < unrolled; i += paperLength) {
      const maxArcLength = outerRadius * 0.5 * Math.PI
      if (rollY + i > rollY - maxArcLength) {
        let offsetX = -outerRadius / 2
        let offsetY = i
        if (i < 0) {
          const angle = Math.PI + (i / (-maxArcLength)) * 0.5 * Math.PI
          offsetX = Math.cos(angle) * outerRadius / 2
          offsetY = Math.sin(angle) * outerRadius
        }
        ctx.moveTo(rollX - rollWidth / 2 + offsetX, rollY + offsetY)
        ctx.lineTo(rollX + rollWidth / 2 + offsetX, rollY + offsetY)
      }
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  window.addEventListener('wheel', function (e) {
    rollVelocity = e.deltaY
  })

  render()
})
