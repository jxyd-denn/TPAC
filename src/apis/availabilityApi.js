import {
    supabase
} from '../lib/supabase'

function requireSupabase() {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    return supabase
}

export async function getDateAvailability(dateId) {
    const client = requireSupabase()
    const {
        data,
        error
    } = await client
        .from('timeline_date_availability')
        .select('date_id, user_id, status')
        .eq('date_id', dateId)

    if (error) throw error
    return data || []
}

export async function setDateAvailability(dateId, status) {
    const client = requireSupabase()
    const {
        data: userData,
        error: userError
    } = await client.auth.getUser()

    if (userError) throw userError
    if (!userData.user) throw new Error('You must be signed in to set availability.')

    const {
        data,
        error
    } = await client
        .from('timeline_date_availability')
        .upsert({
            date_id: dateId,
            user_id: userData.user.id,
            status
        }, {
            onConflict: 'date_id,user_id'
        })
        .select('date_id, user_id, status')
        .single()

    if (error) throw error
    return data
}