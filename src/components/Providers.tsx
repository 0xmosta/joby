'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { WagmiProvider } from '@privy-io/wagmi'

const queryClient = new QueryClient()

const wConfig = createConfig({
  transports: {
    [sepolia.id]: http()
  },
  chains: [sepolia]
})


export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <PrivyProvider
      appId="cm1v0iphw053no39vomxts3mb"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/JobyLogo2.png',
        },
        defaultChain: sepolia,
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}