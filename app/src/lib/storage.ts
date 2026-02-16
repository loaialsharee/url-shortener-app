import { ApiResponse } from "@/app/src/types/apiModels";

const STORAGE_KEY = "pocket-urls";

export function getUrls(): ApiResponse[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function storeUrl(response: ApiResponse) {
    const urls = getUrls();
    const existing = urls.find((u) => u.code === response.code);
    if (existing) return false;

    urls.unshift(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    return true;
}

export function deleteUrl(short_url: string) {
    const urls = getUrls().filter((u) => u.short_url !== short_url);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

export function getShortUrl(shortCode: string): string {
    return `${window.location.origin}/s/${shortCode}`;
}
