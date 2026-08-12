let editingUserId = null

const userTableBody = document.getElementById('userTableBody')
const userEmptyState = document.getElementById('userEmptyState')
const userSearch = document.getElementById('userSearch')
const newUserBtn = document.getElementById('newUserBtn')
const userModalOverlay = document.getElementById('userModalOverlay')
const userModalTitle = document.getElementById('userModalTitle')
const userCancelBtn = document.getElementById('userCancelBtn')
const userSaveBtn = document.getElementById('userSaveBtn')

function assetsFor(userName) {
  return getAssets().filter(a => a.assigned === userName)
}

function renderUsers() {
  const users = getUsers()
  const query = userSearch.value.trim().toLowerCase()

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query) || u.dept.toLowerCase().includes(query)
  )

  userTableBody.innerHTML = ''
  filtered.forEach(user => {
    const userAssets = assetsFor(user.name)
    const assetLabel = userAssets.length
      ? userAssets.map(a => escapeHtml(a.name)).join(', ')
      : '&mdash;'

    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.dept)}</td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${assetLabel}</td>
      <td>
        <div class="row-actions">
          <button class="edit-btn" data-id="${user.id}">Edit</button>
          <button class="delete-btn" data-id="${user.id}">Delete</button>
        </div>
      </td>
    `
    userTableBody.appendChild(tr)
  })

  userEmptyState.classList.toggle('hidden', filtered.length > 0)
}

function openUserModal(user) {
  editingUserId = user ? user.id : null
  userModalTitle.textContent = user ? 'Edit User' : 'Add User'
  document.getElementById('userName').value = user ? user.name : ''
  document.getElementById('userDept').value = user ? user.dept : ''
  document.getElementById('userRole').value = user ? user.role : 'Employee'
  document.getElementById('userEmail').value = user ? user.email : ''
  userModalOverlay.classList.add('active')
}

newUserBtn.addEventListener('click', () => openUserModal(null))
userCancelBtn.addEventListener('click', () => userModalOverlay.classList.remove('active'))

userSaveBtn.addEventListener('click', () => {
  const name = document.getElementById('userName').value.trim()
  const dept = document.getElementById('userDept').value.trim()
  if (!name || !dept) {
    alert('Please fill in at least a name and department.')
    return
  }
  const data = {
    name,
    dept,
    role: document.getElementById('userRole').value.trim() || 'Employee',
    email: document.getElementById('userEmail').value.trim(),
  }

  const users = getUsers()
  if (editingUserId) {
    const user = users.find(u => u.id === editingUserId)
    Object.assign(user, data)
  } else {
    users.push({ id: Date.now(), ...data })
  }
  setUsers(users)
  renderUsers()
  userModalOverlay.classList.remove('active')
})

userTableBody.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id)
  if (!id) return
  const users = getUsers()

  if (e.target.classList.contains('edit-btn')) {
    const user = users.find(u => u.id === id)
    if (user) openUserModal(user)
  }

  if (e.target.classList.contains('delete-btn')) {
    if (confirm('Delete this user? This cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id))
      renderUsers()
    }
  }
})

userSearch.addEventListener('input', renderUsers)
