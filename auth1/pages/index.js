import { useSession, signIn, signOut} from 'next-auth/react'
import { 
  Flex,
  Box,
  Heading, 
  Button,
  Text
}  from '@chakra-ui/react'

export default function Home() {
  const { data: session, status } = useSession()

 
  if (status === 'loading') {
    return <Heading as='h3' fontSize='large'>Loading...</Heading>
  } 
  if (status === 'authenticated') {
    return (
      <>
      Signed in as {session.user.email} <br />
      <button type='button' onClick={() => signOut()}>
        Sign Out
      </button>
      </>
    )
  } else {
    return (
      <>
        Not signed in <br />
        <button type='button' as='a' tareget='_blank' href='/auth/signin'>
          Sign In
        </button>
      </>
    )
  }
}

