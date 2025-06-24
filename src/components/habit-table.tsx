import { useEffect, useRef } from "react"
import moment from "moment"
import { Check, X } from "lucide-react"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "./ui/table"
import { Tables } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client"
import { HABIT_STATUS, HabitStatus } from "@/lib/constants"
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from "@tanstack/react-query"

interface HabitTableProps {
    habits: Tables<"habits">[]
    habitLogs: Tables<"habit_logs">[]
    date: Date
}

export const HabitTable = ({ habits, habitLogs, date }: HabitTableProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const today = moment();

    useEffect(() => {
        if (moment(date).isSame(today, "month")) {
            const todayHeader = containerRef.current?.querySelector(`#day-${today.date()}`);
            if (todayHeader) {
                (todayHeader as HTMLElement).scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest"
                });
            }
        }
    }, [date]);

    const queryClient = useQueryClient()

    const updateHabitLog = async (
        date: Date,
        habit: Tables<"habits">,
        existingLog?: Tables<"habit_logs">
    ) => {
        const supabase = createClient();
        const isoDate = moment.utc(date).startOf("day").toISOString();

        const HABIT_STATUS_CYCLE: HabitStatus[] = [
            HABIT_STATUS.LOGGED,
            HABIT_STATUS.SKIPPED,
            HABIT_STATUS.MISSED,
        ];

        if (existingLog) {
            const currentIndex = HABIT_STATUS_CYCLE.indexOf(
                existingLog.status as HabitStatus
            );
            const nextStatus =
                HABIT_STATUS_CYCLE[(currentIndex + 1) % HABIT_STATUS_CYCLE.length];
            console.log(nextStatus)
            const { error: updateError } = await supabase
                .from("habit_logs")
                .update({ status: nextStatus })
                .eq("id", existingLog.id);

            if (updateError) console.error("Error updating log:", updateError);
        } else {
            console.log(isoDate)
            const { error: insertError } = await supabase.from("habit_logs").insert({
                user_id: habit.user_id,
                habit_id: habit.id,
                date: isoDate,
                status: HABIT_STATUS.LOGGED,
                created_at: moment().toISOString(),
                id: uuidv4(),
            });

            if (insertError) console.error("Error inserting log:", insertError);
        }

        queryClient.invalidateQueries({ queryKey: ['habits-data'] })
    };

    return (
        <div ref={containerRef} className="overflow-x-auto">
            <Table className="min-w-max">
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 z-10 bg-background">Habit</TableHead>
                        {Array.from({ length: moment(date).daysInMonth() }, (_, i) => {
                            const day = i + 1;
                            return (
                                <TableHead
                                    key={day}
                                    id={`day-${day}`}
                                    className="text-center whitespace-nowrap"
                                >
                                    {day}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {habits.map((habit) => {
                        const habitLogForMonth = habitLogs.filter(log =>
                            log.habit_id === habit.id &&
                            moment(log.date).isSame(date, "month")
                        );
                        return (
                            <TableRow key={habit.id}>
                                <TableCell className="sticky left-0 z-10 bg-background">{habit.title}</TableCell>
                                {Array.from({ length: moment(date).daysInMonth() }, (_, i) => {
                                    const day = i + 1;
                                    const log = habitLogForMonth.find(log => moment(log.date).date() === day);
                                    return (
                                        <TableCell key={day} className="px-6 cursor-pointer" onClick={() => updateHabitLog(moment.utc(date).date(day).startOf("day").toDate(), habit, log)}>
                                            <div className="flex justify-center items-center">
                                                {log ? (
                                                    log.status === HABIT_STATUS.LOGGED ? (
                                                        <Check className="text-green-500 w-5 h-5" />
                                                    ) : log.status === 'skipped' ? (
                                                        <span className="text-green-500">-</span>
                                                    ) : (
                                                        <X className="text-red-500 w-5 h-5" />
                                                    )
                                                ) : '-'}
                                            </div>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
