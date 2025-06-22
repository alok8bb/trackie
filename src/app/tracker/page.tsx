"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { Session } from '@supabase/supabase-js'
import GoogleLoginButton from "@/components/google-login-button";
import { AddHabitDialog } from '@/components/add-habit-dialog';

export default function TrackerPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [habitCount, setHabitCount] = useState<number>(0);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        supabase.from('habits').select().then(({ data }) => {
            setHabitCount(data?.length ?? 0)
        })

        return () => subscription.unsubscribe()
    }, [])


    if (!session) {
        return <div className="h-screen w-full items-center flex justify-center">
            <GoogleLoginButton />
        </div>
    } else {
        return <div className="h-screen w-full flex p-10">
            <div className='flex gap-2 justify-between w-full'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Welcome {session?.user?.user_metadata?.full_name?.split(" ")[0] || "Guest"}!
                    </h1>
                    <p>You're tracking {habitCount} habits</p>
                </div>
                <AddHabitDialog />
            </div>
        </div>
    }
}