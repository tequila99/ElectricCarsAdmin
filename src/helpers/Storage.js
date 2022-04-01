export default class Storage {
  constructor (prefix = 'electrocar-admin-panel') {
    if (Storage.instance) return Storage.instance
    this.prefix = prefix
    Storage.instance = this
  }

  setItem (key, value) {
    localStorage.setItem(`${this.prefix}-${key}`, value)
  }

  getItem (key) {
    return localStorage.getItem(`${this.prefix}-${key}`) || null
  }

  removeItem (key) {
    localStorage.removeItem(`${this.prefix}-${key}`)
  }
}
