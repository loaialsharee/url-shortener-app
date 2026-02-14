import { useState } from "react";
import { Link2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/app/src/components/ui/button";
import { Input } from "@/app/src/components/ui/input";


export default function UrlShortenerInput() {
    const [url, setUrl] = useState("");
    const [loading, _] = useState(false);

    const handleSubmit = (e: React.SubmitEvent) => {
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
