"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/use-toast"

export function ToastExample() {
  const { toast } = useToast()

  const handleBasicToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
    })
  }

  const handleErrorToast = () => {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    })
  }

  const handleCustomToast = () => {
    toast({
      title: "Notification",
      description: "This is a custom toast message.",
      action: (
        <Button size="sm" variant="outline">
          Undo
        </Button>
      ),
    })
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">Toast Component Examples</h2>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleBasicToast} variant="default">
          Show Success Toast
        </Button>

        <Button onClick={handleErrorToast} variant="destructive">
          Show Error Toast
        </Button>

        <Button onClick={handleCustomToast} variant="secondary">
          Show Custom Toast
        </Button>
      </div>

      <div className="mt-8 rounded-lg border border-gray-300 p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Usage:</h3>
        <pre className="text-sm overflow-auto bg-white p-3 rounded">
{`import { useToast } from "@/hooks/use-toast"

export function MyComponent() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Success",
      description: "Action completed!",
      variant: "default" // or "destructive"
    })
  }

  return <button onClick={handleClick}>Show Toast</button>
}`}
        </pre>
      </div>
    </div>
  )
}
