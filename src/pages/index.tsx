import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useUserStore from "@/hooks/useUserStore"
import { usePrivy } from "@privy-io/react-auth"
import { EyeOff, Search, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function JobyLanding() {
  const router = useRouter()
  const { login, authenticated, ready, user } = usePrivy()
  const onClickLogin = () => {
    login({ loginMethods: ['github', 'wallet'] })
  }

  useEffect(() => {
    if (ready && authenticated) {
      console.log('authenticated')
      if (user?.github?.name) {
        useUserStore.setState({ username: user.github.name })
      }
      router.push('/onboarding')

    }
  }, [authenticated])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">Joby</span>
          <Image src={'/JobyLogo2.png'} alt="Joby Logo" width={60} height={60} />
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Button onClick={onClickLogin} variant="outline">Log In</Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Dream Job, Anonymously
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Joby helps you discover perfect job opportunities while keeping your identity private. Start your
                  anonymous job search today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter job title or keyword" type="text" />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <EyeOff className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold text-primary">Anonymous Profile</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Create a profile that showcases your skills without revealing your identity.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Shield className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold text-primary">Secure Messaging</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Communicate with potential employers through our secure, anonymous messaging system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Search className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-bold text-primary">Smart Matching</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI-powered system matches you with jobs that fit your skills and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Start Your Anonymous Job Search</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of professionals who have found their ideal jobs without compromising their privacy.
                </p>
              </div>
              <Button onClick={onClickLogin} className="w-full max-w-sm" size="lg">
                Log In to Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Joby. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}