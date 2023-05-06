function getFromLocalStorage(key: string) {
  return localStorage.getItem(key)
}

function setToLocalStorage(key: string, value: string) {
  return localStorage.setItem(key, value)
}

async function getFromStorage(key: string) {
  return getFromLocalStorage(key)
}

async function setToStorage(key: string, value: string) {
  return setToLocalStorage(key, value)
}

export { getFromStorage, setToStorage }
