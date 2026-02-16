export interface ApiResponse {
    code: string;
    short_url: string;
    target_url: string;
    title: string;
}

export interface ErrorResponse {
    error: string;
}

export interface Visit {
    ip_address: string;
    country: string;
    visited_at: string;
}

export interface AnalyticsData {
    short_url: string;
    target_url: string;
    total_clicks: number;
    visits: Visit[];
}
