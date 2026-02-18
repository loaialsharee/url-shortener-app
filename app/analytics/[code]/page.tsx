"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"
import axios from 'axios';
import { ArrowLeft, Globe, MousePointerClick, Clock, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/app/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/src/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/src/components/ui/table";
import { MESSAGES } from "@/app/src/lib/messages";
import { getRelativeTime } from "@/app/src/lib/utils";
import { AnalyticsData } from "@/app/src/types/apiModels";


export default function Analytics() {
    const params = useParams();
    const code = params.code as string;

    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/analytics/${code}`);
            setData(response.data);
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || MESSAGES.errors.analyticsFailed);
            } else {
                setError(MESSAGES.errors.analyticsFailed);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await fetchAnalytics();
    };

    useEffect(() => {
        if (code) {
            fetchAnalytics();
        }
    }, [code]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">{MESSAGES.operations.loading}</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4 capitalize">{MESSAGES.errors.noDataFound}</p>
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {MESSAGES.buttons.back}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const uniqueCountries = new Set(
        data.visits
            .map((v) => v.country)
            .filter((country) => country !== "Unknown")
    ).size;

    const latestVisit = data.visits.length > 0
        ? data.visits.reduce((latest, visit) =>
            new Date(visit.visited_at) > new Date(latest.visited_at) ? visit : latest
        )
        : null;

    return (
        <div className="min-h-screen px-4 pt-12 pb-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {MESSAGES.buttons.back}
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    <RefreshCcw className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                        {MESSAGES.buttons.refresh}
                    </span>
                </Button>
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-3">
                Link Analytics
            </h1>
            <p className="text-sm text-muted-foreground mb-5 font-mono break-all">
                🔗 {data.short_url}
            </p>

            {/* Mobile layout view */}
            <div className="grid grid-cols-3 gap-2 mb-8 sm:hidden">
                <Card>
                    <CardContent className="pt-4 pb-3 px-3">
                        <div className="flex items-center gap-1 mb-1">
                            <MousePointerClick className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{MESSAGES.titles.totalClicks}</p>
                        </div>
                        <p className="text-2xl font-bold">{data.total_clicks}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-3 px-3">
                        <div className="flex items-center gap-1 mb-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{MESSAGES.titles.countries}</p>
                        </div>
                        <p className="text-2xl font-bold">{uniqueCountries}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-3 px-3">
                        <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{MESSAGES.titles.latestVisit}</p>
                        </div>
                        <p className="text-lg font-bold leading-tight mt-2">
                            {latestVisit ?
                                getRelativeTime(latestVisit.visited_at)
                                : "-"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop layout view */}
            <div className="hidden sm:grid grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MousePointerClick className="h-4 w-4" /> {MESSAGES.titles.totalClicks}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{data.total_clicks}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Globe className="h-4 w-4" /> {MESSAGES.titles.countries}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{uniqueCountries}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" /> {MESSAGES.titles.latestVisit}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestVisit ? (
                            <>
                                <p className="text-2xl font-bold">
                                    {getRelativeTime(latestVisit.visited_at)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(latestVisit.visited_at).toLocaleString()}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-1">{MESSAGES.operations.noVisit}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{MESSAGES.titles.recentVisits}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {data.visits.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-6">{MESSAGES.operations.noVisitData}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.visits.map((visit, index) => (
                                    <TableRow key={`${visit.ip_address}-${visit.visited_at}-${index}`}>
                                        <TableCell className="font-mono text-xs">
                                            {visit.ip_address}
                                        </TableCell>
                                        <TableCell>{visit.country}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(visit.visited_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
