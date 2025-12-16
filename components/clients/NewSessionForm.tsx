'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export function NewSessionForm({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    sessionNumber: '',
    summary: '',
    focusArea: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/sessions', {
        clientId,
        sessionNumber: formData.sessionNumber ? parseInt(formData.sessionNumber) : undefined,
        summary: formData.summary || undefined,
        focusArea: formData.focusArea || undefined,
      })
      router.push(`/dashboard/clients/${clientId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Session</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Number (leave empty to auto-increment)
          </label>
          <input
            type="number"
            value={formData.sessionNumber}
            onChange={(e) => setFormData({ ...formData, sessionNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Focus Area
          </label>
          <input
            type="text"
            value={formData.focusArea}
            onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
            placeholder="e.g., Anxiety, Self-esteem, Depression"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Summary
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={5}
            placeholder="Brief summary of the session..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  )
}




