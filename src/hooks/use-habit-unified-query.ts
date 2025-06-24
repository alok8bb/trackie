import { getHabitsWithLogs } from "@/utils/queries";
import useSupabase from "./use-supabase";
import { useQuery } from "@tanstack/react-query";

function useHabitUnifiedQuery() {
    const client = useSupabase();

    return useQuery({
        queryKey: ['habits-data'],
        queryFn: () => getHabitsWithLogs(client),
    });
}

export default useHabitUnifiedQuery;
