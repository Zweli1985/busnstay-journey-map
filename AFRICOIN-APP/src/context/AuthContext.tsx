import React, { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  verified: boolean
  kycStatus: 'pending' | 'in-progress' | 'verified' | 'rejected'
  kycApprovalDate?: string
  wallets: Wallet[]
  createdAt: string
}

export interface Wallet {
  id: string
  address: string
  name: string
  type: 'solana' | 'ethereum' | 'other'
  balance: number
  currency: string
  walletProvider?: 'phantom' | 'solflare' | 'metamask' | 'manual'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (email: string, password: string, firstName: string, lastName: string) => boolean
  updateProfile: (userData: Partial<User>) => void
  addWallet: (wallet: Wallet) => void
  updateKYCStatus: (status: User['kycStatus']) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage
    try {
      const stored = localStorage.getItem('africoin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const saveUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('africoin_user', JSON.stringify(userData))
  }

  const login = (email: string, password: string): boolean => {
    // Mock login - in real app, would call backend API
    if (!email || !password) return false

    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'User',
      phone: '+1234567890',
      verified: false,
      kycStatus: 'pending',
      wallets: [
        {
          id: 'wallet_1',
          address: '3xML9dKE3xNbN4B7Ym5tR8Pq2L4Wx9Vz',
          name: 'Main Solana Wallet',
          type: 'solana',
          balance: 1250.50,
          currency: 'AFR',
          walletProvider: 'phantom'
        },
        {
          id: 'wallet_2',
          address: '0x742d35Cc6634C0532925a3b844Bc1e8c85E6a7BC',
          name: 'Ethereum Account',
          type: 'ethereum',
          balance: 5.25,
          currency: 'ETH'
        }
      ],
      createdAt: new Date().toISOString()
    }

    saveUser(mockUser)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('africoin_user')
  }

  const register = (email: string, password: string, firstName: string, lastName: string): boolean => {
    if (!email || !password || !firstName || !lastName) return false

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      phone: '',
      verified: false,
      kycStatus: 'pending',
      wallets: [],
      createdAt: new Date().toISOString()
    }

    saveUser(newUser)
    return true
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData }
      saveUser(updated)
    }
  }

  const addWallet = (wallet: Wallet) => {
    if (user) {
      const updated = {
        ...user,
        wallets: [...user.wallets, wallet]
      }
      saveUser(updated)
    }
  }

  const updateKYCStatus = (status: User['kycStatus']) => {
    if (user) {
      const updated = {
        ...user,
        kycStatus: status,
        verified: status === 'verified',
        kycApprovalDate: status === 'verified' ? new Date().toISOString() : user.kycApprovalDate
      }
      saveUser(updated)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        addWallet,
        updateKYCStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
