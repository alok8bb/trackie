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
                                        <TableCell key={day} className="px-6">
                                            <div className="flex justify-center items-center">
                                                {log ? (
                                                    log.status === 'logged' ? (
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
