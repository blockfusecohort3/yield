import React, { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { useAppKit } from '@reown/appkit/react'
import RoleSelectionModal from './RoleSelectionModal'

export default function ConnectButton() {
  const { open, account } = useAppKit()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (account) {
      setModalOpen(true)
    }
  }, [account])

  return (
    <>
      <button
        onClick={() => open({ view: 'Connect' })}
        className="relative overflow-hidden bg-green-800 text-white px-6 py-3 rounded-full transition-all duration-500 flex items-center space-x-2 group shadow-lg"
      >
        <Wallet className="relative z-10" />
        <span className="relative z-10">Connect Wallet</span>
      </button>

      <RoleSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRoleSelect={(role) => {
          console.log('Selected role:', role)
          setModalOpen(false)
        }}
      />
    </>
  )
}
