'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Filter, BookOpen } from 'lucide-react'

interface Template {
  id: string
  title: string
  taskDescription: string
  learningObjectives: string
  reflectionPrompts: string
  estimatedTime?: number
  difficultyLevel?: string
  tags: string[]
  status: string
  therapist: {
    name: string
  }
}

export function PublicLibrary({ initialTemplates, userRole }: { initialTemplates: Template[], userRole: string }) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [loading, setLoading] = useState(false)

  const allTags = Array.from(new Set(templates.flatMap(t => t.tags)))
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }
        const res = await axios.get(`/api/templates?${params.toString()}`)
        setTemplates(res.data)
      } catch (err) {
        console.error('Failed to fetch templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedTags])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.taskDescription.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDifficulty = !selectedDifficulty || template.difficultyLevel === selectedDifficulty
    
    return matchesSearch && matchesDifficulty
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Public Library</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {template.estimatedTime && (
                  <p><strong>Time:</strong> {template.estimatedTime} minutes</p>
                )}
                {template.difficultyLevel && (
                  <p><strong>Difficulty:</strong> {template.difficultyLevel}</p>
                )}
                <p><strong>By:</strong> {template.therapist.name}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 line-clamp-3" dangerouslySetInnerHTML={{ __html: template.taskDescription.substring(0, 150) + '...' }} />
            </div>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No templates found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}




