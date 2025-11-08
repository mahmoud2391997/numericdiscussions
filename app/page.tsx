'use client'

import { DiscussionsProvider } from '@/context/discussions-context'
import MainView from '@/components/main-view'

export default function Home() {
  return (
    <DiscussionsProvider>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="container mx-auto p-4 sm:p-8">
          <MainView />
        </div>
      </main>
    </DiscussionsProvider>
  )
}
