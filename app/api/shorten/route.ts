import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { MESSAGES } from '@/app/src/lib/messages';

interface RequestBody {
    target_url: string;
}

interface BackendResponse {
    short_url: string;
    target_url: string;
    title: string;
}

interface BackendError {
    error: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();

        const response = await axios.post<BackendResponse>(
            `${process.env.API_BASE}/shorten`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {

        if (axios.isAxiosError(error)) {

            const apiError = error.response?.data as BackendError;

            console.log(apiError.error)

            return NextResponse.json(
                { error: apiError?.error || MESSAGES.errors.unexpectedError },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: MESSAGES.errors.unexpectedError },
            { status: 500 }
        );
    }
}