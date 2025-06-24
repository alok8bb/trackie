"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { Session } from '@supabase/supabase-js'
import GoogleLoginButton from "@/components/google-login-button";
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { HabitTable } from "@/components/habit-table";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useHabitUnifiedQuery from "@/hooks/use-habit-unified-query";


export default function TrackerPage() {
    const [session, setSession] = useState<Session | null>(null);
    const supabase = createClient();
    const [date, setDate] = useState<Date>(new Date());

    const { data: habitData, isLoading, isError } = useHabitUnifiedQuery();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])


    if (!session) {
        return <div className="h-screen w-full items-center flex justify-center">
            <GoogleLoginButton />
        </div>
    } else {
        return <div className="h-screen w-full flex p-10 flex-col">
            <div className='flex gap-2 justify-between w-full'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Welcome {session?.user?.user_metadata?.full_name?.split(" ")[0] || "Guest"}!
                    </h1>
                    <p>You're tracking {habitData?.habits.length} habits</p>
                </div>
                <AddHabitDialog />
            </div>
            <div className="my-4 flex items-center gap-2">
                <ChevronLeft className="cursor-pointer" onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setDate(newDate);
                }} />
                <Label className="text-lg font-semibold select-none">{date.toLocaleString('default', { 'month': 'long' })}</Label>
                <ChevronRight className="cursor-pointer" onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setDate(newDate);
                }} />
            </div>
            {habitData && habitData.habits && habitData.habitLogs ?
                <HabitTable habits={habitData.habits} habitLogs={habitData.habitLogs} date={date} />
                : <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">No habits found. Start by adding a habit!</p>
                </div>}
        </div>
    }
}