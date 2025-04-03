const storage = window.sessionStorage
//这里用sessionStorage是页面生命周期 用localStorage是长期生命周期 
const TOKEN_KEY = 'token'
const TIME_KEY = "expires_in"
const NAME_KEY = "user_name"
const EMAIL_KEY = "user_email"
const PHOTO_KEY = "user_photo"
export function getToken() {
  console.log('Try to get Token', storage.getItem(TOKEN_KEY))
  return storage.getItem(TOKEN_KEY) || undefined
}
 
export function setToken(token) {
  storage.setItem(TOKEN_KEY, token)
}
 
export function removeToken() {
  storage.removeItem(TOKEN_KEY)
}

export function getTime() {
  console.log('Try to get Time', storage.getItem(TIME_KEY))
  return storage.getItem(TIME_KEY) || undefined
}
 
export function setTime(time) {
  storage.setItem(TIME_KEY, time)
}
 
export function removeTime() {
  storage.removeItem(TIME_KEY)
}

export function getName() {
  console.log('Try to get Name', storage.getItem(NAME_KEY))
  return storage.getItem(NAME_KEY) || undefined
}
 
export function setName(name) {
  storage.setItem(NAME_KEY, name)
}
 
export function removeName() {
  storage.removeItem(NAME_KEY)
}

export function getEmail() {
  console.log('Try to get Email', storage.getItem(EMAIL_KEY))
  return storage.getItem(EMAIL_KEY) || undefined
}
 
export function setEmail(email) {
  storage.setItem(EMAIL_KEY, email)
}
 
export function removeEmail() {
  storage.removeItem(EMAIL_KEY)
}

export function getPhoto() {
  console.log('Try to get Photo', storage.getItem(PHOTO_KEY))
  return storage.getItem(PHOTO_KEY) || undefined
}
 
export function setPhoto(email) {
  storage.setItem(PHOTO_KEY, email)
}
 
export function removePhoto() {
  storage.removeItem(PHOTO_KEY)
}

export function removeAll(){
  storage.removeItem(TOKEN_KEY)
  storage.removeItem(TIME_KEY)
  storage.removeItem(NAME_KEY)
  storage.removeItem(EMAIL_KEY)
  storage.removeItem(PHOTO_KEY)
}