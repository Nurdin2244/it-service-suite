const navItems = document.querySelectorAll('.nav-item')
const pages = document.querySelectorAll('.page')
const pageTitle = document.getElementById('pageTitle')
const sidebar = document.getElementById('sidebar')
const menuToggle = document.getElementById('menuToggle')

const titles = {
  dashboard: 'Dashboard',
  tickets: 'Tickets',
  assets: 'Assets',
  onboarding: 'Onboarding & Offboarding',
  users: 'Users',
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.dataset.page

    navItems.forEach((n) => n.classList.remove('active'))
    item.classList.add('active')

    pages.forEach((p) => p.classList.remove('active'))
    document.getElementById(`page-${target}`).classList.add('active')

    pageTitle.textContent = titles[target]

    // close the sidebar automatically on mobile after picking a page
    sidebar.classList.remove('open')
  })
})

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open')
})

renderDashboard()
