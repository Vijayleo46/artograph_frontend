'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

interface FormData {
  email: string
  password: string
  name: string
}

export function FormExample() {
  const [submitted, setSubmitted] = useState<FormData | null>(null)
  
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    setSubmitted(data)
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Form Component Example</h1>
        <p className="text-gray-600">Integrated with react-hook-form for validation and state management</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <input
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your full name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We'll never share your email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 6 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      {/* Show submitted data */}
      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-bold text-green-900 mb-2">Form Submitted!</h2>
          <pre className="text-sm text-green-800 overflow-auto">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
