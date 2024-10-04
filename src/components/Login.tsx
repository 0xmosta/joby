import { usePrivy } from "@privy-io/react-auth"
import { Button } from "./ui/button"

const Login = () => {
  const { login } = usePrivy()
  return (
    <Button variant='default' onClick={() => login({ loginMethods: ['github', 'wallet'] })}>
      Login
    </Button>
  )
}