// Draws a simple vertical bar chart on a canvas.
// bars: [{ label, value, color }]
function drawBarChart(canvasId, bars) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  ctx.clearRect(0, 0, width, height)

  const maxValue = Math.max(...bars.map(b => b.value), 1)
  const paddingBottom = 30
  const paddingTop = 24
  const chartHeight = height - paddingBottom - paddingTop
  const barWidth = width / bars.length
  const barGap = 24

  ctx.font = '12px Arial'
  ctx.textAlign = 'center'

  bars.forEach((bar, i) => {
    const barHeight = (bar.value / maxValue) * chartHeight
    const x = i * barWidth + barGap / 2
    const barW = barWidth - barGap
    const y = paddingTop + (chartHeight - barHeight)

    ctx.fillStyle = bar.color
    ctx.fillRect(x, y, barW, barHeight)

    // value label above the bar
    ctx.fillStyle = '#232323'
    ctx.fillText(String(bar.value), x + barW / 2, y - 6)

    // category label below the bar
    ctx.fillStyle = '#666'
    ctx.fillText(bar.label, x + barW / 2, height - 10)
  })
}

function renderDashboard() {
  const tickets = getTickets()
  const assets = getAssets()
  const onboarding = getOnboarding()

  // stat cards
  const openTickets = tickets.filter(t => t.status !== 'resolved').length
  const assetsInUse = assets.filter(a => a.status === 'In Use').length

  const today = new Date()
  const in30Days = new Date(today)
  in30Days.setDate(in30Days.getDate() + 30)
  const upcomingCount = onboarding.filter(r => {
    const d = new Date(r.date)
    return d >= today && d <= in30Days
  }).length

  document.getElementById('statOpenTickets').textContent = openTickets
  document.getElementById('statAssetsInUse').textContent = assetsInUse
  document.getElementById('statUpcoming').textContent = upcomingCount
  document.getElementById('statTotalAssets').textContent = assets.length

  // tickets by priority chart
  const priorities = ['Low', 'Medium', 'High']
  const priorityColors = { Low: '#3d7a4f', Medium: '#c9922e', High: '#b0392f' }
  const ticketBars = priorities.map(p => ({
    label: p,
    value: tickets.filter(t => t.priority === p).length,
    color: priorityColors[p],
  }))
  drawBarChart('ticketsChart', ticketBars)

  // assets by status chart
  const statuses = ['In Use', 'In Storage', 'Retired']
  const statusColors = { 'In Use': '#3d7a4f', 'In Storage': '#c9922e', 'Retired': '#8a8a8a' }
  const assetBars = statuses.map(s => ({
    label: s,
    value: assets.filter(a => a.status === s).length,
    color: statusColors[s],
  }))
  drawBarChart('assetsChart', assetBars)

  // upcoming onboarding/offboarding list, soonest first
  const upcomingList = document.getElementById('upcomingList')
  const sorted = [...onboarding].sort((a, b) => new Date(a.date) - new Date(b.date))

  upcomingList.innerHTML = sorted.slice(0, 6).map(r => `
    <li>
      <span class="upcoming-type ${r.type.toLowerCase()}">${r.type}</span>
      <span class="upcoming-name">${escapeHtml(r.name)}</span>
      <span class="upcoming-dept">${escapeHtml(r.dept)}</span>
      <span class="upcoming-date">${escapeHtml(r.date)}</span>
    </li>
  `).join('')
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}
