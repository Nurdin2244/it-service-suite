// Shared data layer for the IT Service Suite.
// Every module (Dashboard, Tickets, Assets, Onboarding) reads and writes
// through these functions instead of managing its own separate storage,
// so a ticket can eventually reference a real asset or person.

const KEYS = {
  tickets: 'suite-tickets',
  assets: 'suite-assets',
  onboarding: 'suite-onboarding',
}

function seedTickets() {
  return [
    { id: 1, title: 'Printer not connecting to network', requester: 'Sarah - Accounting', category: 'Hardware', priority: 'Medium', status: 'todo' },
    { id: 2, title: 'Password reset request', requester: 'James - Sales', category: 'Account Access', priority: 'Low', status: 'todo' },
    { id: 3, title: 'VPN keeps disconnecting', requester: 'Amina - Remote Team', category: 'Network', priority: 'High', status: 'progress' },
    { id: 4, title: 'New laptop setup', requester: 'Tom - Marketing', category: 'Hardware', priority: 'Medium', status: 'resolved' },
  ]
}

function seedAssets() {
  return [
    { id: 1, name: 'Dell Latitude 5420', type: 'Laptop', serial: 'SN-4821X', assigned: 'Sarah Miller', status: 'In Use', date: '2024-03-14', location: 'Main Office - Floor 2' },
    { id: 2, name: 'HP LaserJet Pro', type: 'Printer', serial: 'SN-9012P', assigned: '', status: 'In Storage', date: '2023-11-02', location: 'Supply Room' },
    { id: 3, name: 'Dell UltraSharp 27"', type: 'Monitor', serial: 'SN-3345M', assigned: 'James Cole', status: 'In Use', date: '2024-01-20', location: 'Main Office - Floor 1' },
    { id: 4, name: 'iPhone SE (2020)', type: 'Phone', serial: 'SN-7781PH', assigned: '', status: 'Retired', date: '2021-06-10', location: 'IT Storage' },
  ]
}

function seedOnboarding() {
  const today = new Date()
  const inDays = (n) => {
    const d = new Date(today)
    d.setDate(d.getDate() + n)
    return d.toISOString().slice(0, 10)
  }
  return [
    { id: 1, name: 'Maria Schmidt', dept: 'Accounting', type: 'Onboarding', date: inDays(5), items: makeItems('Onboarding', 3) },
    { id: 2, name: 'Tom Weber', dept: 'Sales', type: 'Offboarding', date: inDays(10), items: makeItems('Offboarding', 0) },
    { id: 3, name: 'Lena Fischer', dept: 'IT', type: 'Onboarding', date: inDays(20), items: makeItems('Onboarding', 0) },
  ]
}

const CHECKLIST_TEMPLATES = {
  Onboarding: [
    'Create Active Directory / user account',
    'Set up company email',
    'Assign laptop or desktop',
    'Install standard software',
    'Grant VPN / remote access',
    'Add to relevant groups and distribution lists',
    'Set up multi-factor authentication',
    'Provide login credentials securely',
    'Schedule IT orientation walkthrough',
  ],
  Offboarding: [
    'Disable user account',
    'Revoke email access',
    'Revoke VPN / remote access',
    'Remove from groups and distribution lists',
    'Collect laptop and equipment',
    'Back up or transfer important data',
    'Disable MFA / security tokens',
    'Update asset inventory records',
  ],
}

function makeItems(type, doneCount) {
  return CHECKLIST_TEMPLATES[type].map((text, i) => ({ text, done: i < doneCount }))
}

function loadData(key, seedFn) {
  const saved = localStorage.getItem(key)
  if (saved) return JSON.parse(saved)
  const seeded = seedFn()
  localStorage.setItem(key, JSON.stringify(seeded))
  return seeded
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getTickets() { return loadData(KEYS.tickets, seedTickets) }
function getAssets() { return loadData(KEYS.assets, seedAssets) }
function getOnboarding() { return loadData(KEYS.onboarding, seedOnboarding) }

function setTickets(data) { saveData(KEYS.tickets, data) }
function setAssets(data) { saveData(KEYS.assets, data) }
function setOnboarding(data) { saveData(KEYS.onboarding, data) }
