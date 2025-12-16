'use client'

import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export function ButtonExample() {
  const [clicked, setClicked] = useState(0)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" onClick={() => setClicked(clicked + 1)}>
            Default Button
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🎯</Button>
        </div>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <p className="text-green-800">
          Button clicked {clicked} times
        </p>
      </div>
    </div>
  )
}
