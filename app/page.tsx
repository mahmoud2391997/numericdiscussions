"use client"

import { Header } from "@/components/header"
import { AuthForm } from "@/components/auth-form"
import { NewPostForm } from "@/components/new-post-form"
import { CalculationNode } from "@/components/calculation-node"
import { useDiscussions } from "@/context/discussions-context"

export default function Home() {
  const {
    users,
    calculationTrees,
    currentUser,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleNewPost,
    handleReply,
  } = useDiscussions()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="p-4 sm:p-8">
        {!currentUser ? (
          <AuthForm onLogin={handleLogin} onRegister={handleRegister} isLoading={loading} />
        ) : (
          <NewPostForm onNewPost={handleNewPost} isLoading={loading} />
        )}

        <div className="container mx-auto mt-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
            Discussions
          </h2>
          {calculationTrees.length > 0 ? (
            calculationTrees.map((tree) => (
              <div key={tree.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <CalculationNode
                  node={tree}
                  users={users}
                  onReply={handleReply}
                  currentUser={currentUser}
                  isLoading={loading}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              <p>No discussions yet. Log in and start one!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
