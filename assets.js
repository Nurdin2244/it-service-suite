let editingAssetId = null

const assetTableBody = document.getElementById('assetTableBody')
const assetEmptyState = document.getElementById('assetEmptyState')
const assetSearch = document.getElementById('assetSearch')
const assetTypeFilter = document.getElementById('assetTypeFilter')
const assetStatusFilter = document.getElementById('assetStatusFilter')
const newAssetBtn = document.getElementById('newAssetBtn')
const assetModalOverlay = document.getElementById('assetModalOverlay')
const assetModalTitle = document.getElementById('assetModalTitle')
const assetCancelBtn = document.getElementById('assetCancelBtn')
const assetSaveBtn = document.getElementById('assetSaveBtn')
const exportAssetsBtn = document.getElementById('exportAssetsBtn')

function assetStatusClass(status) {
  if (status === 'In Use') return 'in-use'
  if (status === 'In Storage') return 'in-storage'
  return 'retired'
}

function renderAssets() {
  const assets = getAssets()
  const query = assetSearch.value.trim().toLowerCase()
  const typeVal = assetTypeFilter.value
  const statusVal = assetStatusFilter.value

  const filtered = assets.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(query) ||
      a.serial.toLowerCase().includes(query) ||
      (a.assigned || '').toLowerCase().includes(query)
    const matchesType = !typeVal || a.type === typeVal
    const matchesStatus = !statusVal || a.status === statusVal
    return matchesQuery && matchesType && matchesStatus
  })

  assetTableBody.innerHTML = ''
  filtered.forEach(asset => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${escapeHtml(asset.name)}</td>
      <td>${escapeHtml(asset.type)}</td>
      <td>${escapeHtml(asset.serial)}</td>
      <td>${escapeHtml(asset.assigned) || '&mdash;'}</td>
      <td><span class="status-tag ${assetStatusClass(asset.status)}">${escapeHtml(asset.status)}</span></td>
      <td>${escapeHtml(asset.date)}</td>
      <td>${escapeHtml(asset.location)}</td>
      <td>
        <div class="row-actions">
          <button class="edit-btn" data-id="${asset.id}">Edit</button>
          <button class="delete-btn" data-id="${asset.id}">Delete</button>
        </div>
      </td>
    `
    assetTableBody.appendChild(tr)
  })

  assetEmptyState.classList.toggle('hidden', filtered.length > 0)
}

function openAssetModal(asset) {
  editingAssetId = asset ? asset.id : null
  assetModalTitle.textContent = asset ? 'Edit Asset' : 'Add Asset'
  document.getElementById('assetName').value = asset ? asset.name : ''
  document.getElementById('assetType').value = asset ? asset.type : 'Laptop'
  document.getElementById('assetSerial').value = asset ? asset.serial : ''
  document.getElementById('assetAssigned').value = asset ? asset.assigned : ''
  document.getElementById('assetStatus').value = asset ? asset.status : 'In Use'
  document.getElementById('assetDate').value = asset ? asset.date : ''
  document.getElementById('assetLocation').value = asset ? asset.location : ''
  assetModalOverlay.classList.add('active')
}

newAssetBtn.addEventListener('click', () => openAssetModal(null))
assetCancelBtn.addEventListener('click', () => assetModalOverlay.classList.remove('active'))

assetSaveBtn.addEventListener('click', () => {
  const name = document.getElementById('assetName').value.trim()
  const serial = document.getElementById('assetSerial').value.trim()
  if (!name || !serial) {
    alert('Please fill in at least an asset name and serial number.')
    return
  }
  const data = {
    name,
    type: document.getElementById('assetType').value,
    serial,
    assigned: document.getElementById('assetAssigned').value.trim(),
    status: document.getElementById('assetStatus').value,
    date: document.getElementById('assetDate').value,
    location: document.getElementById('assetLocation').value.trim(),
  }

  const assets = getAssets()
  if (editingAssetId) {
    const asset = assets.find(a => a.id === editingAssetId)
    Object.assign(asset, data)
  } else {
    assets.push({ id: Date.now(), ...data })
  }
  setAssets(assets)
  renderAssets()
  renderDashboard()
  assetModalOverlay.classList.remove('active')
})

assetTableBody.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id)
  if (!id) return
  const assets = getAssets()

  if (e.target.classList.contains('edit-btn')) {
    const asset = assets.find(a => a.id === id)
    if (asset) openAssetModal(asset)
  }

  if (e.target.classList.contains('delete-btn')) {
    if (confirm('Delete this asset? This cannot be undone.')) {
      setAssets(assets.filter(a => a.id !== id))
      renderAssets()
      renderDashboard()
    }
  }
})

assetSearch.addEventListener('input', renderAssets)
assetTypeFilter.addEventListener('change', renderAssets)
assetStatusFilter.addEventListener('change', renderAssets)

exportAssetsBtn.addEventListener('click', () => {
  const assets = getAssets()
  const headers = ['Asset Name', 'Type', 'Serial Number', 'Assigned To', 'Status', 'Purchase Date', 'Location']
  const rows = assets.map(a => [a.name, a.type, a.serial, a.assigned, a.status, a.date, a.location])
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'it-asset-inventory.csv'
  link.click()
  URL.revokeObjectURL(url)
})
