import Header from "./Header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <footer>Dashboard Footer</footer>
    </div>
  )
}