// app/api/analytics/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AnalyticsResponse, ErrorResponse } from '@/app/src/types/apiModels';
import { MESSAGES } from '@/app/src/lib/messages';

export async function GET(
    _: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params;

        const response = await axios.get<AnalyticsResponse>(
            `${process.env.API_BASE}/analytics/${code}`
        );

        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data as ErrorResponse;
            return NextResponse.json(
                { error: errorData?.error || MESSAGES.errors.analyticsFailed },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: MESSAGES.errors.unexpectedError },
            { status: 500 }
        );
    }
}