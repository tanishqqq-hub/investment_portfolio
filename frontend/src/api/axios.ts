import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL as string

if (!BASE_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables')
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})