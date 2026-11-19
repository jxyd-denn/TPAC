import {
    supabase
} from '../lib/supabase'

function requireSupabase() {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    return supabase
}

export async function getTimelineDates() {
    const client = requireSupabase()
    const {
        data,
        error
    } = await client
        .from('timeline_dates')
        .select('*')
        .order('date_value', {
            ascending: true
        })

    if (error) throw error
    return data || []
}

export async function createTimelineDates(rows) {
    const client = requireSupabase()
    const {
        data: sessionData,
        error: sessionError
    } = await client.auth.getSession()

    if (sessionError) throw sessionError

    const ownerId = sessionData && sessionData.session ?
        sessionData.session.user.id :
        null
    if (!ownerId) throw new Error('You must be signed in to add a date.')

    const repeatGroupId = rows.length > 1 ? crypto.randomUUID() : null
    const inserts = rows.map((row) => ({
        ...row,
        owner_id: ownerId,
        repeat_group_id: repeatGroupId,
    }))

    const {
        data,
        error
    } = await client
        .from('timeline_dates')
        .insert(inserts)
        .select()

    if (error) throw error
    return data
}

export async function updateTimelineDate(id, updates) {
    const client = requireSupabase()
    const {
        data,
        error
    } = await client
        .from('timeline_dates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteTimelineDate(id) {
    const client = requireSupabase()
    const {
        error
    } = await client
        .from('timeline_dates')
        .delete()
        .eq('id', id)

    if (error) throw error
}