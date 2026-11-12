import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/expenses',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export const expenseApi = {
  async getAll(category) {
    const path = category
      ? `/category/${encodeURIComponent(category)}`
      : ''
    const { data } = await api.get(path)
    return data
  },
  async create(expense) {
    const { data } = await api.post('', expense)
    return data
  },
  async update(id, expense) {
    const { data } = await api.put(`/${id}`, expense)
    return data
  },
  async delete(id) {
    await api.delete(`/${id}`)
  },
}

export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const validationMessages = Object.values(
      error.response?.data?.validationErrors || {},
    ).filter(Boolean)

    if (validationMessages.length > 0) {
      return validationMessages.join('. ')
    }

    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.'
    }

    if (!error.response) {
      return 'Unable to reach the expense service. Check that the backend is running.'
    }
  }

  return 'Something went wrong. Please try again.'
}
