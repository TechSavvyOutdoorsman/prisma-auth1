import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import {
    signIn,
    getSession,
} from 'next-auth'
import {
    Box, 
    useToast,
    Flex,
    Stack,
    Button,
    Heading,
    Text,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'


const MagicLinkModal = ({ show = false, email = '' }) => {
    if (!show) return null

    return createPortal(
        <Flex
            align='center'
            justify='center'
            m={4}
            flexDir='column'
        >
            <Heading as='h2' fontSize='x-large'>Check Your Email Stupid!</Heading>
            <Text as='p' fontSize='medium'>Link was sent to {email}</Text>
        </Flex>,
        document.body
    )
}

export default function SignIn() {
    const router = useRouter()
    const toast = useToast()

    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let intervalId, redirecting
    
        if (showModal) {
          setInterval(async () => {
            const session = await getSession()
            if (session && !redirecting) {
              // User connected using the magic link -> redirect him/her
              redirecting = true
              router.push(router.query?.callbackUrl || '/')
            }
          }, 1000)
        }
    
        return () => {
            intervalId && clearInterval(intervalId)
          };
        }, [showModal, router])

        const handleSignIn = async e => {
            e.preventDefault()
            let toastId
            try {
               toastId =  toast({
                    title: 'Loading...',
                    status: 'info',
                    duration: 1000,
                    isClosable: true,
                })
            //   toastId = toast.loading('Loading...');
              setDisabled(true)
              // Perform sign in
              const { error } = await signIn('email', {
                email,
                redirect: false,
                callbackUrl: `${window.location.origin}/auth/confirm-request`,
              })
              // Something went wrong
              if (error) {
                throw new Error(error)
              }
              setShowModal(true)
              toast({
                title: 'Loading...',
                status: 'success',
                duration: 1000,
                isClosable: true,
            })
            //   toast.success('Magic link successfully sent', { id: toastId });
            } catch (error) {
              console.log(error)
              toast({
                title: 'Loading...',
                status: 'error',
                duration: 1000,
                isClosable: true,
            })
            //   toast.error('Unable to send magic link', { id: toastId });
            } finally {
              setDisabled(false)
            }
          };
        
    
    return (
        <Box>
            <Flex
                align='center'
                justify='center'
                flexDir='column'
                gap={6}
            >
            <form onSubmit={handleSignIn} method='POST'>
                <FormControl>
                    <FormLabel htmlFor='email'>Email Address</FormLabel>
                    <Input required value={email} placeholder='elon@spacex.com' disabled={disabled} onChange={e => setEmail(e.target.value)} type='text' id='email' name='email' />
                    <Button disabled={disabled} type='submit'>{disabled ? 'Loading...' : 'Sign In'}</Button>
                </FormControl>
            </form>
            <MagicLinkModal show={showModal} email={email} />
            </Flex>
        </Box>
    )
}


// export async function getServerSideProps(ctx) {
//     const { req } = ctx
//     const session = await getSession({ req })

//     if (session) {
//         return {
//           redirect: { destination: "/" },
//         };
//       }

//     return {
//         props: {
//             session: session,
//             providers: await providers(ctx),
//             csrfToken: await csrfToken(ctx)
//         }
//     }
// } 