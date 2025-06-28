import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";

export default function GoogleLoginButton() {
    const getBaseUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return 'https://trackie.online';
    };

    return <Button onClick={async () => {
        const supabase = createClient();
        const baseUrl = getBaseUrl();


        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${baseUrl}/auth/callback?next=/tracker`,
            }
        })

        if (error) {
            console.error("Supabase signInWithOAuth error:", error.message);
            alert("Failed to sign in with Google. Please try again.");
        }
    }}>Continue with Google</Button>
}