import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePrivy } from "@privy-io/react-auth"
import { EyeOff, Search, Shield, Briefcase, Lock, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function JobyLanding() {
  const router = useRouter()
  const { login, authenticated, ready, user } = usePrivy()
  const onClickLogin = () => {
    login({ loginMethods: ['github', 'wallet', 'email', 'google'] })
  }

  const setUserInfo = async () => {
    if (ready && authenticated) {
      console.log('authenticated')
      const response = await fetch('/api/auth/user-info')
      console.log(response);
      router.push('/onboarding')
    }
  }

  useEffect(() => {
    setUserInfo()
  }, [authenticated])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link className="flex items-center justify-center" href="/">
          <Image src={'/JobyLogo2.png'} alt="Joby Logo" width={60} height={60} />
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Button onClick={onClickLogin} variant="outline" className="font-semibold text-white border-white hover:bg-gray-800">Log In</Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Find Your Dream Job, <span className="text-primary">ANONYMOUSLY</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl text-gray-300">
                  Joby helps you discover perfect job opportunities while keeping your identity private. Start your
                  anonymous job search today.
                </p>
              </div>
              <Button onClick={onClickLogin} size="lg" className="mt-8 text-lg font-bold bg-primary hover:bg-primary/80 text-white">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Joby?</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <EyeOff className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-primary">Anonymous Profile</h3>
                <p className="text-gray-300">
                  Create a profile that showcases your skills without revealing your identity.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-primary">Secure Messaging</h3>
                <p className="text-gray-300">
                  Communicate with potential employers through our secure, anonymous messaging system.
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
                <p className="mx-auto max-w-[600px] md:text-xl text-gray-300">
                  Join thousands of professionals who have found their ideal jobs without compromising their privacy.
                </p>
              </div>
              <Button onClick={onClickLogin} className="w-full max-w-sm text-lg font-bold bg-primary hover:bg-primary/80 text-white" size="lg">
                Log In to Get Started
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Lock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Create Your Profile</h3>
                <p className="text-gray-300">Build an anonymous profile highlighting your skills and experience.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Explore Opportunities</h3>
                <p className="text-gray-300">Browse job listings tailored to your profile and preferences.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Connect Anonymously</h3>
                <p className="text-gray-300">Engage with potential employers while maintaining your privacy.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full bg-gray-800">
        <div className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700 max-w-7xl mx-auto">
          <p className="text-xs text-gray-400">© 2024 Joby. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs text-gray-400 hover:text-white hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs text-gray-400 hover:text-white hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
