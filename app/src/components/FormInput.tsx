import { useState } from "react";
import { Link2, ArrowRight, Loader2 } from "lucide-react";
import axios from 'axios';
import { Button } from "@/app/src/components/ui/button";
import { Input } from "@/app/src/components/ui/input";
import { toast } from "sonner";

interface ApiResponse {
    short_url: string;
    target_url: string;
    title: string;
}

interface ErrorResponse {
    error: string;
}


export default function UrlShortenerInput() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post<ApiResponse>('/api/shorten',
                { target_url: url },
            );

            toast.success("URL shortened successfully! 🎉", {
                position: "top-center", style: {
                    '--normal-bg':
                        'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
                    '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
                    '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
                } as React.CSSProperties
            })
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errData = err.response?.data as ErrorResponse;
                setError(errData?.error || 'Request failed');
                toast.error(error, {
                    position: "top-center", style: {
                        '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
                        '--normal-text': 'var(--destructive)',
                        '--normal-border': 'var(--destructive)'
                    } as React.CSSProperties
                })
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Paste your long URL here..."
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); }}
                        className="pl-10 h-12 text-base bg-card border-border"
                    />
                </div>
                <Button type="submit" disabled={loading || !url.trim()} className="h-12 px-6 text-base font-medium">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Shorten</span><ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
            </form>

        </div>
    );
}
