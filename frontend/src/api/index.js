import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('taskflow_token')
      localStorage.removeItem('taskflow_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Tasks
export const getTasks = (params) => API.get('/tasks', { params })
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)
export const updateTaskStage = (id, stage) => API.patch(`/tasks/${id}/stage`, { stage })

export default API
