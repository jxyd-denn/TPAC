import {
    supabase
} from '../lib/supabase'

function requireSupabase() {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    return supabase
}

export async function getEvents() {
    const client = requireSupabase()
    const {
        data,
        error
    } = await client
        .from('events')
        .select('id, title, description, event_date, color, created_at')
        .order('event_date', {
            ascending: true
        })

    if (error) throw error
    return data || []
}

export async function createEvent({
    title,
    description,
    eventDate,
    color
}) {
    const client = requireSupabase()
    const {
        data: sessionData,
        error: sessionError
    } = await client.auth.getSession()

    if (sessionError) throw sessionError

    const ownerId = sessionData.session ? .user ? .id
    if (!ownerId) throw new Error('You must be signed in to create an event.')

    const {
        data,
        error
    } = await client
        .from('events')
        .insert({
            owner_id: ownerId,
            title,
            description,
            event_date: eventDate,
            color,
        })
        .select()
        .single()

    if (error) throw error
    return data
}