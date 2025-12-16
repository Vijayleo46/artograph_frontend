'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

interface Client {
  id: string
  name: string
  email: string
  age?: number
  gender?: string
  condition?: string
  therapyGoals?: string
}

interface Session {
  id: string
  sessionNumber: number
  summary?: string
  focusArea?: string
}

export function AssignmentGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clients, setClients] = useState<Client[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [preferences, setPreferences] = useState({
    tone: '',
    assignmentType: '',
    exampleOutputStyle: '',
  })
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load clients on mount
  useEffect(() => {
    axios.get('/api/clients').then((res) => {
      setClients(res.data)
      
      // Check for URL parameters
      const clientIdParam = searchParams.get('clientId')
      const sessionIdParam = searchParams.get('sessionId')
      
      if (clientIdParam) {
        setSelectedClientId(clientIdParam)
        // Load sessions for this client
        axios.get(`/api/sessions?clientId=${clientIdParam}`).then((sessionRes) => {
          setSessions(sessionRes.data)
          // If sessionId is also in URL, select it
          if (sessionIdParam) {
            setSelectedSessionId(sessionIdParam)
          }
        }).catch((err) => {
          console.error('Failed to load sessions:', err)
        })
      }
    }).catch((err) => {
      setError('Failed to load clients')
    })
  }, [searchParams])

  const handleClientChange = async (clientId: string) => {
    setSelectedClientId(clientId)
    setSelectedSessionId('')
    if (clientId) {
      try {
        const res = await axios.get(`/api/sessions?clientId=${clientId}`)
        setSessions(res.data)
      } catch (err) {
        setError('Failed to load sessions')
      }
    } else {
      setSessions([])
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || !selectedSessionId) {
      setError('Please select both client and session')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/api/assignments/generate', {
        clientId: selectedClientId,
        sessionId: selectedSessionId,
        visibility: visibility,
        preferences: Object.keys(preferences).reduce((acc, key) => {
          if (preferences[key as keyof typeof preferences]) {
            acc[key] = preferences[key as keyof typeof preferences]
          }
          return acc
        }, {} as Record<string, string>),
      })

      router.push(`/dashboard/assignments/${res.data.id}/edit`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate AI Assignment</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
            Select Client *
          </label>
          <select
            id="client"
            value={selectedClientId}
            onChange={(e) => handleClientChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.email ? `(${client.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
            Select Session *
          </label>
          <select
            id="session"
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            required
            disabled={!selectedClientId || sessions.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          >
            <option value="">Choose a session...</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                Session {session.sessionNumber} {session.focusArea ? `- ${session.focusArea}` : ''}
              </option>
            ))}
          </select>
          {selectedClientId && sessions.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">No sessions found for this client</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                Tone Preference
              </label>
              <input
                type="text"
                id="tone"
                value={preferences.tone}
                onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}
                placeholder="e.g., Supportive, Professional, Encouraging"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type
              </label>
              <input
                type="text"
                id="assignmentType"
                value={preferences.assignmentType}
                onChange={(e) => setPreferences({ ...preferences, assignmentType: e.target.value })}
                placeholder="e.g., Behavioral Activation, Journaling, Mindfulness"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                Output Style
              </label>
              <input
                type="text"
                id="style"
                value={preferences.exampleOutputStyle}
                onChange={(e) => setPreferences({ ...preferences, exampleOutputStyle: e.target.value })}
                placeholder="e.g., Clear and structured, Conversational"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Visibility
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={visibility === 'PRIVATE'}
                    onChange={(e) => setVisibility(e.target.value as 'PRIVATE' | 'PUBLIC')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Private (Client-specific, personalized)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={visibility === 'PUBLIC'}
                    onChange={(e) => setVisibility(e.target.value as 'PRIVATE' | 'PUBLIC')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Public (Generic, reusable template)</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {visibility === 'PRIVATE' 
                  ? 'Assignment will be personalized for this specific client and session context.'
                  : 'Assignment will be more generic and suitable for sharing as a public template.'}
              </p>
            </div>
          </div>
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
            disabled={loading || !selectedClientId || !selectedSessionId}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Assignment'}
          </button>
        </div>
      </form>
    </div>
  )
}

