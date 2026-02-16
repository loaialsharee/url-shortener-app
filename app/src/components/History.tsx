import { ExternalLink, Trash2, Copy, ChartNoAxesCombined } from "lucide-react";
import { Button } from "@/app/src/components/ui/button";
import { Globe, CaptionsIcon } from "lucide-react";
import { deleteUrl } from "@/app/src/lib/storage";
import { ApiResponse } from "@/app/src/types/apiModels";
import { toast } from "sonner";
import { MESSAGES } from "@/app/src/lib/messages";
import { useRouter } from 'next/navigation';

interface Props {
    urls: ApiResponse[];
    onDelete: (shortUrl: string) => void;
}

export default function History({ urls, onDelete }: Props) {

    const router = useRouter();

    const copy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl);
        toast.success(MESSAGES.success.copied, {
            position: "top-center", style: {
                '--normal-bg':
                    'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
                '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
                '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
            } as React.CSSProperties
        });
    };

    const handleDelete = (shortUrl: string) => {
        deleteUrl(shortUrl);
        onDelete(shortUrl);
    };

    const handleViewAnalytics = (code: string) => {
        router.push(`/analytics/${code}`);
    }

    if (urls.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                MY POCKET LINKS
            </h2>
            <div className="space-y-2">
                {urls.map((u) => (
                    <div
                        key={u.code}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border animate-fade-in"
                    >
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-mono text-primary truncate">
                                {u.short_url}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground truncate leading-tight">
                                    {u.target_url}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <CaptionsIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground truncate leading-tight">
                                    {u.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={u.short_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(u.short_url)}>
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewAnalytics(u.code)}>
                                <ChartNoAxesCombined className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(u.short_url)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
