// local storage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const getLocalStorage = (key, value) => {
        return JSON.parse(localStorage.getItem(key))
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key)
    }
}

export const clearLocalStorage = () => {
    if (process.browser) {
        localStorage.clear()
    }
}