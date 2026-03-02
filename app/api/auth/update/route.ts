import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession, signToken } from '@/lib/auth'
import { updateUser } from '@/lib/db'

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { username, password } = await req.json()

        if (!username) {
            return NextResponse.json({ error: 'Username wajib diisi' }, { status: 400 })
        }

        let hashedPassword = undefined
        if (password) {
            if (password.length < 6) {
                return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
            }
            hashedPassword = await bcrypt.hash(password, 10)
        }

        await updateUser(session.id, username, hashedPassword)

        // Update token if username changed
        const newToken = signToken({ id: session.id, username })
        const res = NextResponse.json({ success: true })
        res.cookies.set('token', newToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return res
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
