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

    let { data, error } = await client
        .from('profiles')
        .select('id, first_name, last_name, club_role, avatar_url, created_at')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        const fallback = await client
            .from('profiles')
            .select('id, first_name, last_name, club_role, created_at')
            .eq('id', userId)
            .maybeSingle()
        if (fallback.error) throw fallback.error
        data = fallback.data
    }
    return data ? {
        ...data,
        id: userId
    } : null
}

export async function updateProfile({
    firstName,
    lastName,
    avatarUrl
}) {
    const client = requireSupabase()
    const {
        data: sessionData,
        error: sessionError
    } = await client.auth.getSession()
    if (sessionError) throw sessionError
    const userId = sessionData && sessionData.session ?
        sessionData.session.user.id :
        null
    if (!userId) throw new Error('You must be signed in to update your profile.')

    const {
        data,
        error
    } = await client
        .from('profiles')
        .update({
            first_name: firstName,
            last_name: lastName,
            avatar_url: avatarUrl || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, first_name, last_name, club_role, avatar_url, created_at')
        .single()

    if (error) throw error
    return data
}

export async function uploadProfileAvatar(file) {
    const client = requireSupabase()
    const {
        data: sessionData,
        error: sessionError
    } = await client.auth.getSession()
    if (sessionError) throw sessionError
    const userId = sessionData && sessionData.session ?
        sessionData.session.user.id :
        null
    if (!userId) throw new Error('You must be signed in to upload a picture.')

    const path = `${userId}/${crypto.randomUUID()}-${file.name}`
    const {
        error: uploadError
    } = await client.storage.from('avatars').upload(path, file, {
        upsert: false
    })
    if (uploadError) throw uploadError
    return client.storage.from('avatars').getPublicUrl(path).data.publicUrl
}

export async function deleteAccount() {
    const client = requireSupabase()
    const {
        error
    } = await client.rpc('delete_current_account')
    if (error) throw error
}

export async function logoutAccount() {
    const client = requireSupabase()
    const {
        error
    } = await client.auth.signOut()

    if (error) throw error
}