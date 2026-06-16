import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <ShoppingBag className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-1">Welcome back</h1>
        <p className="text-stone-500 text-center text-sm mb-8">Sign in to your account</p>
        <LoginForm />
        <p className="text-center text-sm text-stone-500 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
