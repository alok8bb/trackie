import { TypedSupabaseClient } from "./supabase/client";

export function getHabits(
    client: TypedSupabaseClient,
) {
    return client
        .from('habits')
        .select()
}

export function getHabitLogs(
    client: TypedSupabaseClient,
) {
    return client
        .from('habit_logs')
        .select()
}

export async function getHabitsWithLogs(client: TypedSupabaseClient) {
    const [habitsRes, habitLogsRes] = await Promise.all([
        getHabits(client),
        getHabitLogs(client)
    ]);

    const habits = habitsRes.data ?? [];
    const habitLogs = habitLogsRes.data ?? [];

    return {
        habits,
        habitLogs
    };
}