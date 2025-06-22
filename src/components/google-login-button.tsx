import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";

export default function GoogleLoginButton() {

    return <Button onClick={async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/tracker`,
            }
        })
    }}>Continue with Google</Button>
}