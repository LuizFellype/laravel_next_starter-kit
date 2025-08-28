import Navigation from '@/app/(app)/Navigation'
import axios from '@/lib/axios'
import { redirect } from 'next/dist/server/api-utils'
import { cookies } from 'next/headers'

const preFetchUserOnServer = async () => {
    const token = cookies().get('XSRF-TOKEN')?.value
    const session = cookies().get('laravel-session')?.value
    const cookieValue = `XSRF-TOKEN=${token}; laravel-session=${session}`

    let user = null

    if (token) {
        try {
            const res = await axios.get('/api/user', {
                headers: {
                    Cookie: cookieValue,
                    'X-XSRF-TOKEN': token,
                    origin: 'http://localhost:3000',
                },
                next: { revalidate: 0 }
            })
            user = res.data
        } catch (error) {
            console.error('Error fetching user data:', error)
            redirect('/login')
        }
    }

    return user
}

const AppLayout = async ({ children }) => {
    const user = await preFetchUserOnServer()

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout
