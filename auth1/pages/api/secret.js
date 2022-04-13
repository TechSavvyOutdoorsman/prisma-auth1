import { getSession } from 'next-auth/react'


const secretHandler = async (req, res) => {
    const session = await getSession({ req })
     if (session) {
         res.end(
             `Welcome to the VIP club, ${session.user.email}`
         )
     } else {
         res.statusCode = 403
         res.end("Hold on, you're not allowed in here!!! Get the fuck out of here!!! Now!!!!!")
     }
}


export default secretHandler