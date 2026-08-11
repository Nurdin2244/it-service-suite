const onboardRecordList = document.getElementById('onboardRecordList')
const onboardEmptyState = document.getElementById('onboardEmptyState')
const onboardSearch = document.getElementById('onboardSearch')
const onboardTypeFilter = document.getElementById('onboardTypeFilter')
const newOnboardBtn = document.getElementById('newOnboardBtn')
const onboardModalOverlay = document.getElementById('onboardModalOverlay')
const onboardCancelBtn = document.getElementById('onboardCancelBtn')
const onboardSaveBtn = document.getElementById('onboardSaveBtn')
const onboardType = document.getElementById('onboardType')
const onboardDateLabel = document.getElementById('onboardDateLabel')

let openRecordIds = new Set()

function progressOf(record) {
  const done = record.items.filter(i => i.done).length
  return Math.round((done / record.items.length) * 100)
}

function renderOnboarding() {
  const records = getOnboarding()
  const query = onboardSearch.value.trim().toLowerCase()
  const typeVal = onboardTypeFilter.value

  const filtered = records.filter(r => {
    const matchesQuery = r.name.toLowerCase().includes(query) || r.dept.toLowerCase().includes(query)
    const matchesType = !typeVal || r.type === typeVal
    return matchesQuery && matchesType
  })

  onboardRecordList.innerHTML = ''

  filtered.forEach(record => {
    const progress = progressOf(record)
    const isOpen = openRecordIds.has(record.id)
    const card = document.createElement('div')
    card.className = 'record-card' + (isOpen ? ' open' : '')
    card.dataset.id = record.id

    const itemsHtml = record.items.map((item, i) => `
      <div class="checklist-item">
        <input type="checkbox" data-index="${i}" id="onboard-item-${record.id}-${i}" ${item.done ? 'checked' : ''}>
        <label for="onboard-item-${record.id}-${i}" class="${item.done ? 'done' : ''}">${escapeHtml(item.text)}</label>
      </div>
    `).join('')

    card.innerHTML = `
      <div class="record-header">
        <div class="record-info">
          <div class="record-name">${escapeHtml(record.name)}</div>
          <div class="record-meta">
            <span class="type-tag ${record.type.toLowerCase()}">${record.type}</span>
            &nbsp; ${escapeHtml(record.dept)} &middot; ${escapeHtml(record.date)}
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
          <div class="progress-text">${progress}% complete</div>
        </div>
        <span class="expand-icon">&#9660;</span>
      </div>
      <div class="checklist">
        ${itemsHtml}
        <div class="record-actions">
          <button class="delete-btn">Delete Record</button>
        </div>
      </div>
    `
    onboardRecordList.appendChild(card)
  })

  onboardEmptyState.classList.toggle('hidden', filtered.length > 0)
}

onboardRecordList.addEventListener('click', (e) => {
  const card = e.target.closest('.record-card')
  if (!card) return
  const id = Number(card.dataset.id)
  const records = getOnboarding()
  const record = records.find(r => r.id === id)
  if (!record) return

  if (e.target.classList.contains('delete-btn')) {
    if (confirm(`Delete the record for ${record.name}? This cannot be undone.`)) {
      setOnboarding(records.filter(r => r.id !== id))
      openRecordIds.delete(id)
      renderOnboarding()
      renderDashboard()
    }
    return
  }

  if (e.target.matches('input[type="checkbox"]')) {
    const index = Number(e.target.dataset.index)
    record.items[index].done = e.target.checked
    setOnboarding(records)
    openRecordIds.add(id)
    renderOnboarding()
    renderDashboard()
    return
  }

  if (e.target.closest('.record-header')) {
    if (openRecordIds.has(id)) {
      openRecordIds.delete(id)
    } else {
      openRecordIds.add(id)
    }
    renderOnboarding()
  }
})

onboardSearch.addEventListener('input', renderOnboarding)
onboardTypeFilter.addEventListener('change', renderOnboarding)

newOnboardBtn.addEventListener('click', () => onboardModalOverlay.classList.add('active'))
onboardCancelBtn.addEventListener('click', () => onboardModalOverlay.classList.remove('active'))

onboardType.addEventListener('change', () => {
  onboardDateLabel.textContent = onboardType.value === 'Onboarding' ? 'Start Date' : 'Last Day'
})

onboardSaveBtn.addEventListener('click', () => {
  const name = document.getElementById('onboardName').value.trim()
  const dept = document.getElementById('onboardDept').value.trim()
  const type = onboardType.value
  const date = document.getElementById('onboardDate').value

  if (!name || !dept) {
    alert('Please fill in a name and department.')
    return
  }

  const records = getOnboarding()
  records.push({
    id: Date.now(),
    name,
    dept,
    type,
    date,
    items: makeItems(type, 0),
  })
  setOnboarding(records)
  renderOnboarding()
  renderDashboard()

  document.getElementById('onboardName').value = ''
  document.getElementById('onboardDept').value = ''
  document.getElementById('onboardDate').value = ''
  onboardModalOverlay.classList.remove('active')
})
