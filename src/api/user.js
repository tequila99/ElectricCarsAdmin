import Api from 'src/helpers/Api'
const api = new Api()

export const signIn = async (username, password) => api.client.post('/api/v1/auth', { username, password }).then(res => res.data)

export const signOut = async refreshToken => api.client.post('/api/v1/auth/logout', { token: refreshToken }).then(res => res.data)

export const checkStatus = async () => api.client.post('/api/v1/auth/status').then(res => res.data)

// export default { signIn, signOut }
