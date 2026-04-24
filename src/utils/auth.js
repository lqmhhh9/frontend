const CURRENT_USER_KEY = 'currentUser'

export function setCurrentUser(username) {
  if (!username) {
    return
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    username
  }))
}

export function getCurrentUser() {
  const raw = window.localStorage.getItem(CURRENT_USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    window.localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export function getCurrentUsername() {
  const user = getCurrentUser()
  return user && user.username ? user.username : ''
}

export function clearCurrentUser() {
  window.localStorage.removeItem(CURRENT_USER_KEY)
}
