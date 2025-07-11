import axios from 'axios'
import type { BehaviorData } from '../types/BehaviorData'

export const loginWithBehavior = async (data: {
  email: string
  password: string
  behavior: BehaviorData
}) => {
  try {
    const res = await axios.post('http://localhost:4000/api/login', data)
    return res.data
  } catch (error) {
    console.error('Login failed:', error)
    return null
  }
}
