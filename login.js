const SESSION_KEY = 'suite-session'

const loginScreen = document.getElementById('loginScreen')
const appEl = document.getElementById('app')
const loginName = document.getElementById('loginName')
const loginRole = document.getElementById('loginRole')
const loginBtn = document.getElementById('loginBtn')
const userInfo = document.getElementById('userInfo')
const logoutBtn = document.getElementById('logoutBtn')

function getSession() {
  const saved = sessionStorage.getItem(SESSION_KEY)
  return saved ? JSON.parse(saved) : null
}

function showApp(session) {
  loginScreen.classList.add('hidden')
  appEl.classList.add('visible')
  userInfo.textContent = `${session.name} · ${session.role}`
}

function showLogin() {
  loginScreen.classList.remove('hidden')
  appEl.classList.remove('visible')
}

loginBtn.addEventListener('click', () => {
  const name = loginName.value.trim()
  if (!name) {
    alert('Please enter your name.')
    return
  }
  const session = { name, role: loginRole.value }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  showApp(session)
})

// pressing Enter in the name field logs in too, instead of only clicking the button
loginName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn.click()
})

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY)
  loginName.value = ''
  showLogin()
})

// on page load, skip the login screen if a session already exists
const existingSession = getSession()
if (existingSession) {
  showApp(existingSession)
} else {
  showLogin()
}
