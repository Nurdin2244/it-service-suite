const ticketListEls = {
  todo: document.getElementById('list-todo'),
  progress: document.getElementById('list-progress'),
  resolved: document.getElementById('list-resolved'),
}
const ticketCountEls = {
  todo: document.getElementById('count-todo'),
  progress: document.getElementById('count-progress'),
  resolved: document.getElementById('count-resolved'),
}
const ticketSearch = document.getElementById('ticketSearch')
const newTicketBtn = document.getElementById('newTicketBtn')
const ticketModalOverlay = document.getElementById('ticketModalOverlay')
const ticketCancelBtn = document.getElementById('ticketCancelBtn')
const ticketSaveBtn = document.getElementById('ticketSaveBtn')

function renderTickets() {
  const tickets = getTickets()
  const query = ticketSearch.value.trim().toLowerCase()

  Object.values(ticketListEls).forEach(el => el.innerHTML = '')

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.requester.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query)
  )

  filtered.forEach(ticket => {
    const card = document.createElement('div')
    card.className = `card priority-${ticket.priority}`
    card.draggable = true
    card.dataset.id = ticket.id

    card.innerHTML = `
      <div class="card-title">${escapeHtml(ticket.title)}</div>
      <div class="card-meta">
        <span>${escapeHtml(ticket.requester)} - ${escapeHtml(ticket.category)}</span>
        <span class="priority-tag ${ticket.priority}">${ticket.priority}</span>
      </div>
      <button class="card-delete" data-id="${ticket.id}">Delete</button>
    `
    card.addEventListener('dragstart', () => card.classList.add('dragging'))
    card.addEventListener('dragend', () => card.classList.remove('dragging'))

    ticketListEls[ticket.status].appendChild(card)
  })

  Object.keys(ticketCountEls).forEach(status => {
    ticketCountEls[status].textContent = tickets.filter(t => t.status === status).length
  })
}

Object.keys(ticketListEls).forEach(status => {
  const listEl = ticketListEls[status]
  listEl.addEventListener('dragover', (e) => { e.preventDefault(); listEl.classList.add('drag-over') })
  listEl.addEventListener('dragleave', () => listEl.classList.remove('drag-over'))
  listEl.addEventListener('drop', (e) => {
    e.preventDefault()
    listEl.classList.remove('drag-over')
    const draggingCard = document.querySelector('.dragging')
    if (!draggingCard) return
    const id = Number(draggingCard.dataset.id)
    const tickets = getTickets()
    const ticket = tickets.find(t => t.id === id)
    if (ticket) {
      ticket.status = status
      setTickets(tickets)
      renderTickets()
      renderDashboard()
    }
  })
})

document.getElementById('page-tickets').addEventListener('click', (e) => {
  if (e.target.classList.contains('card-delete')) {
    const id = Number(e.target.dataset.id)
    const tickets = getTickets().filter(t => t.id !== id)
    setTickets(tickets)
    renderTickets()
    renderDashboard()
  }
})

function populateTicketRequesterOptions() {
  const select = document.getElementById('ticketRequester')
  const users = getUsers()
  select.innerHTML = users.map(u => `<option value="${escapeHtml(u.name)} - ${escapeHtml(u.dept)}">${escapeHtml(u.name)} (${escapeHtml(u.dept)})</option>`).join('')
}

ticketSearch.addEventListener('input', renderTickets)
newTicketBtn.addEventListener('click', () => {
  populateTicketRequesterOptions()
  ticketModalOverlay.classList.add('active')
})
ticketCancelBtn.addEventListener('click', () => ticketModalOverlay.classList.remove('active'))

ticketSaveBtn.addEventListener('click', () => {
  const title = document.getElementById('ticketTitle').value.trim()
  const requester = document.getElementById('ticketRequester').value
  if (!title || !requester) {
    alert('Please fill in a title and pick a requester.')
    return
  }
  const tickets = getTickets()
  tickets.push({
    id: Date.now(),
    title,
    requester,
    category: document.getElementById('ticketCategory').value,
    priority: document.getElementById('ticketPriority').value,
    status: 'todo',
  })
  setTickets(tickets)
  renderTickets()
  renderDashboard()

  document.getElementById('ticketTitle').value = ''
  ticketModalOverlay.classList.remove('active')
})
