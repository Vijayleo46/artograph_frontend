'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'

export function CardExample() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Card Component Examples</h1>

      {/* Basic Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Card</CardTitle>
          <CardDescription>This is a simple card with header and content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Cards are used to group related content together. They provide visual separation and organization.
          </p>
        </CardContent>
      </Card>

      {/* Card with Footer and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Card with Actions</CardTitle>
          <CardDescription>Click the buttons below to interact</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            This card demonstrates how to use buttons within a card layout.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Submit</Button>
        </CardFooter>
      </Card>

      {/* Multiple Cards in Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Multiple Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">This is card number {i}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Card with Custom Styling */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Styled Card</CardTitle>
          <CardDescription className="text-blue-700">
            You can customize card styling with className prop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800">
            Pass custom classes to override default styles.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
