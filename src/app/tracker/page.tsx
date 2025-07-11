"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { Session } from '@supabase/supabase-js'
import GoogleLoginButton from "@/components/google-login-button";
import { AddHabitDialog } from '@/components/add-habit-dialog';
import { HabitTable } from "@/components/habit-table";
import { Label } from "@radix-ui/react-label";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import useHabitUnifiedQuery from "@/hooks/use-habit-unified-query";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function TrackerPage() {
    const [session, setSession] = useState<Session | null>(null);
    const supabase = createClient();
    const [date, setDate] = useState<Date>(new Date());
    const router = useRouter();

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

    async function logout() { 
        await supabase.auth.signOut()
        setSession(null);
        router.push("/");
    }


    if (!session) {
        return <div className="h-screen w-full items-center flex justify-center">
            <GoogleLoginButton />
        </div>
    } else {
        return <div className="h-screen w-full flex p-10 flex-col">
            <div className='flex gap-2 justify-between w-full'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-100'>
                        Welcome {session?.user?.user_metadata?.full_name?.split(" ")[0] || "Guest"}!
                    </h1>
                    <p className="text-gray-300">you're tracking {habitData?.habits.length} habits</p>
                </div>
                <div className="flex gap-8 items-center">
                    <AddHabitDialog />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={session?.user?.user_metadata?.picture || ""} alt={session?.user?.user_metadata?.full_name || "User Avatar"} className="w-10 h-10 rounded-full" />
                                <AvatarFallback className="w-10 h-10 rounded-full bg-gray-500 text-white">PF</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-2">
                             {/* I don't know why default styles weren't working, so I'm slapping a button instead  */}
                            <Button variant={"outline"} onClick={logout}>Logout</Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="my-4 flex items-center gap-2">
                <ChevronLeft className="h-5 w-5 cursor-pointer" onClick={() => {
                    const newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setDate(newDate);
                }} />
                <Calendar className="cursor-pointer h-4 w-4" onClick={() => setDate(new Date())} />
                <Label className="text-md font-semibold select-none">{date.toLocaleString('default', { 'month': 'long' })}</Label>
                <ChevronRight className="h-5 w-5 cursor-pointer" onClick={() => {
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