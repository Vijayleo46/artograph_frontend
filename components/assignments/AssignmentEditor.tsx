'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import axios from 'axios'
import { Save, Send, Copy, Eye, BookOpen } from 'lucide-react'

interface Assignment {
  id: string
  title: string
  taskDescription: string
  learningObjectives: string
  reflectionPrompts: string
  estimatedTime?: number
  difficultyLevel?: string
  status: string
  client: {
    name: string
    email: string
  }
  session: {
    sessionNumber: number
  }
}

export function AssignmentEditor({ assignmentId }: { assignmentId: string }) {
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [therapistNote, setTherapistNote] = useState('')
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [templateTags, setTemplateTags] = useState('')
  const [templateStatus, setTemplateStatus] = useState('PRIVATE')

  console.log('AssignmentEditor loading with ID:', assignmentId)

  const titleEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Assignment title...' })],
    content: '',
  })

  const descriptionEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Task description...' })],
    content: '',
  })

  const objectivesEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Learning objectives...' })],
    content: '',
  })

  const promptsEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Reflection prompts...' })],
    content: '',
  })

  useEffect(() => {
    axios.get(`/api/assignments/${assignmentId}`).then((res) => {
      const data = res.data
      setAssignment(data)
      titleEditor?.commands.setContent(`<h1>${data.title}</h1>`)
      descriptionEditor?.commands.setContent(data.taskDescription)
      objectivesEditor?.commands.setContent(data.learningObjectives)
      promptsEditor?.commands.setContent(data.reflectionPrompts)
      setLoading(false)
    }).catch((err) => {
      console.error('Failed to load assignment:', err)
      setError(`Failed to load assignment: ${err.response?.data?.error || err.message}`)
      setLoading(false)
    })
  }, [assignmentId, titleEditor, descriptionEditor, objectivesEditor, promptsEditor])

  const handleSave = async () => {
    if (!titleEditor || !descriptionEditor || !objectivesEditor || !promptsEditor) return

    setSaving(true)
    setError('')

    try {
      const title = titleEditor.getText().trim()
      const taskDescription = descriptionEditor.getHTML()
      const learningObjectives = objectivesEditor.getHTML()
      const reflectionPrompts = promptsEditor.getHTML()

      await axios.put(`/api/assignments/${assignmentId}`, {
        title,
        taskDescription,
        learningObjectives,
        reflectionPrompts,
        estimatedTime: assignment?.estimatedTime,
        difficultyLevel: assignment?.difficultyLevel,
      })

      router.refresh()
      alert('Assignment saved successfully!')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save assignment')
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    if (!titleEditor || !descriptionEditor || !objectivesEditor || !promptsEditor) return

    setSending(true)
    setError('')

    try {
      const title = titleEditor.getText().trim()
      const taskDescription = descriptionEditor.getHTML()
      const learningObjectives = objectivesEditor.getHTML()
      const reflectionPrompts = promptsEditor.getHTML()

      // Save first
      await axios.put(`/api/assignments/${assignmentId}`, {
        title,
        taskDescription,
        learningObjectives,
        reflectionPrompts,
      })

      // Then send
      const res = await axios.post(`/api/assignments/${assignmentId}/send`, {
        therapistNote,
      })

      if (res.data.success) {
        alert('Assignment sent successfully!')
        router.push('/dashboard/assignments')
      } else {
        setError(res.data.error || 'Failed to send assignment')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send assignment')
    } finally {
      setSending(false)
    }
  }

  const handleClone = async () => {
    if (!assignment) return
    try {
      const res = await axios.post(`/api/assignments/${assignmentId}/clone`, {
        clientId: assignment.client ? assignment.client.id : undefined,
        sessionId: assignment.session ? assignment.session.id : undefined,
      })
      router.push(`/dashboard/assignments/${res.data.id}/edit`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to clone assignment')
    }
  }

  const handleSaveTemplate = async () => {
    if (!titleEditor || !descriptionEditor || !objectivesEditor || !promptsEditor) return

    setSavingTemplate(true)
    setError('')

    try {
      const tags = templateTags.split(',').map(t => t.trim()).filter(t => t)
      await axios.post(`/api/assignments/${assignmentId}/save-template`, {
        tags,
        status: templateStatus,
      })
      alert('Template saved successfully!')
      setShowTemplateForm(false)
      setTemplateTags('')
      setTemplateStatus('PRIVATE')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save template')
    } finally {
      setSavingTemplate(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading assignment...</div>
  }

  if (!assignment) {
    return <div className="text-center py-12 text-red-600">Assignment not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleClone}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Copy className="h-4 w-4 mr-2" />
            Clone
          </button>
          <button
            onClick={() => setShowTemplateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Save as Template
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4 text-sm text-gray-600">
          <p><strong>Client:</strong> {assignment.client.name} ({assignment.client.email})</p>
          <p><strong>Session:</strong> Session {assignment.session.sessionNumber}</p>
          <p><strong>Status:</strong> {assignment.status}</p>
        </div>

        {showPreview ? (
          <div className="space-y-6 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: titleEditor?.getHTML() || '' }} />
            <div>
              <h2>Task Description</h2>
              <div dangerouslySetInnerHTML={{ __html: descriptionEditor?.getHTML() || '' }} />
            </div>
            <div>
              <h2>Learning Objectives</h2>
              <div dangerouslySetInnerHTML={{ __html: objectivesEditor?.getHTML() || '' }} />
            </div>
            <div>
              <h2>Reflection Prompts</h2>
              <div dangerouslySetInnerHTML={{ __html: promptsEditor?.getHTML() || '' }} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <div className="border border-gray-300 rounded-md p-3 min-h-[60px]">
                <EditorContent editor={titleEditor} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <div className="border border-gray-300 rounded-md p-3 min-h-[200px]">
                <EditorContent editor={descriptionEditor} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <div className="border border-gray-300 rounded-md p-3 min-h-[200px]">
                <EditorContent editor={objectivesEditor} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reflection Prompts
              </label>
              <div className="border border-gray-300 rounded-md p-3 min-h-[200px]">
                <EditorContent editor={promptsEditor} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Therapist Note (optional, included in email)
              </label>
              <textarea
                value={therapistNote}
                onChange={(e) => setTherapistNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add a personal note for your client..."
              />
            </div>
          </div>
        )}
      </div>

      {showTemplateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Save as Template</h3>
              <button
                onClick={() => setShowTemplateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={templateTags}
                  onChange={(e) => setTemplateTags(e.target.value)}
                  placeholder="e.g., anxiety, CBT, journaling"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={templateStatus}
                  onChange={(e) => setTemplateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PENDING">Publish to Public Library</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={savingTemplate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {savingTemplate ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

