import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'

export function AddHabitDialog() {
    const [habitTitle, setHabitTitle] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });
    }, []);

    const queryClient = useQueryClient();

    const addHabit = async () => {
        if (!habitTitle) {
            return;
        }
        const supabase = createClient();
        const { data, error } = await supabase
            .from('habits')
            .insert({
                id: uuidv4(),
                title: habitTitle,
                user_id: session?.user.id,
                created_at: moment().toISOString(),
            })
            .select();

        if (error) {
            console.error("Error adding habit:", error);
        } else {
            queryClient.invalidateQueries({queryKey: ['habits-data']});
            setOpen(false); 
            setHabitTitle(""); 
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">New Habit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Habit</DialogTitle>
                        <DialogDescription>
                            Add a new habit to track.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Reading" onChange={(e) => setHabitTitle(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={addHabit}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}