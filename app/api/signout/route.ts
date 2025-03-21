import { getDataFromToken } from "@/lib/hooks/getDataFromToken";
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {

        const authUser = await getDataFromToken()

        if (!authUser) {
            return new Response('You are not logged in, sign in first.', { status: 401 })
        }

        // Delete cookie too
        cookies().delete('token')
        return new Response('User has been signed out successfully.', { status: 200 })
    } catch (error: any) {

        console.error('Error signing out: ', error);
        return new Response('Internal server error.', { status: 500 })
    }
}