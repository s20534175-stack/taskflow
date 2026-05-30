import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getMe } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token')
    const storedUser = localStorage.getItem('taskflow_user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('taskflow_token')
          localStorage.removeItem('taskflow_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    localStorage.setItem('taskflow_token', res.data.token)
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name, email, password) => {
    const res = await apiRegister({ name, email, password })
    localStorage.setItem('taskflow_token', res.data.token)
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('taskflow_token')
    localStorage.removeItem('taskflow_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
