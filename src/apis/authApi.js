import {
    isSupabaseConfigured,
    supabase
} from '../lib/supabase'

function requireSupabase() {
    if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase is not configured yet.')
    }

    return supabase
}

export async function registerAccount({
    firstName,
    lastName,
    email,
    clubRole,
    password
}) {
    const client = requireSupabase()

    const {
        data,
        error
    } = await client.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                club_role: clubRole,
            },
        },
    })

    if (error) throw error
    return data
}

export async function loginAccount({
    email,
    password
}) {
    const client = requireSupabase()

    const {
        data,
        error
    } = await client.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

export async function getCurrentSession() {
    const client = requireSupabase()
    const {
        data,
        error
    } = await client.auth.getSession()

    if (error) throw error
    return data.session
}

export async function getCurrentProfile() {
    const client = requireSupabase()

    const sessionResult = await client.auth.getSession()

    if (sessionResult.error) throw sessionResult.error

    const userId = sessionResult.data && sessionResult.data.session ?
        sessionResult.data.session.user.id :
        null

    if (!userId) return null

    const {
        data,
        error
    } = await client
        .from('profiles')
        .select('id, first_name, last_name, club_role, created_at')
        .eq('id', userId)
        .maybeSingle()

    if (error) throw error
    return data ? {
        ...data,
        id: userId
    } : null
}

export async function logoutAccount() {
    const client = requireSupabase()
    const {
        error
    } = await client.auth.signOut()

    if (error) throw error
}