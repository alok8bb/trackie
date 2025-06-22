"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function TrackerPage() {
    
    return <div className="h-screen w-full items-center flex justify-center">
        <Button onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/tracker`,
                }
            })
        }}>Continue with Google</Button> 
    </div>
}