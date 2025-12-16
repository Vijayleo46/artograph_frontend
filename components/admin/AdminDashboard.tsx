'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Check, X, Eye } from 'lucide-react'

interface Template {
  id: string
  title: string
  taskDescription: string
  learningObjectives: string
  reflectionPrompts: string
  tags: string[]
  therapist: {
    name: string
    email: string
  }
}

export function AdminDashboard({ initialPendingTemplates, stats }: { initialPendingTemplates: Template[], stats: any }) {
  const router = useRouter()
  const [templates, setTemplates] = useState(initialPendingTemplates)
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (templateId: string) => {
    setLoading(templateId)
    try {
      await axios.put(`/api/templates/${templateId}`, { status: 'APPROVED' })
      setTemplates(templates.filter(t => t.id !== templateId))
      router.refresh()
    } catch (err) {
      console.error('Failed to approve template')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (templateId: string) => {
    setLoading(templateId)
    try {
      await axios.put(`/api/templates/${templateId}`, { status: 'REJECTED' })
      setTemplates(templates.filter(t => t.id !== templateId))
      router.refresh()
    } catch (err) {
      console.error('Failed to reject template')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Total Clients</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalClients}</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Total Assignments</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalAssignments}</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Pending Templates</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingTemplates}</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Template Approvals</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-500">No pending templates</p>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-500">By {template.therapist.name} ({template.therapist.email})</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(template.id)}
                        disabled={loading === template.id}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(template.id)}
                        disabled={loading === template.id}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Description:</strong>
                      <div className="mt-1" dangerouslySetInnerHTML={{ __html: template.taskDescription.substring(0, 200) + '...' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




