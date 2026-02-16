import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Analytics from '@/app/analytics/[code]/page';
import axios from 'axios';
import * as navigation from 'next/navigation';
import { AnalyticsData } from '@/app/src/types/apiModels';
import { MESSAGES } from '../lib/messages';

jest.mock('axios');
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Analytics Page', () => {
    const mockAnalyticsData: AnalyticsData = {
        short_url: 'https://url-shortener-api-dv8v.onrender.com/abc123',
        target_url: 'https://example.com',
        total_clicks: 42,
        visits: [
            {
                ip_address: '192.168.1.1',
                country: 'Malaysia',
                visited_at: '2026-02-15T10:00:00Z',
            },
            {
                ip_address: '192.168.1.2',
                country: 'Singapore',
                visited_at: '2026-02-14T15:30:00Z',
            },
            {
                ip_address: '192.168.1.3',
                country: 'Unknown',
                visited_at: '2026-02-13T08:00:00Z',
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (navigation.useParams as jest.Mock).mockReturnValue({ code: 'abc123' });

        (navigation.useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        });

        mockedAxios.isAxiosError.mockReturnValue(false);
    });

    it('should show loading state initially', () => {
        mockedAxios.get.mockImplementation(() =>
            new Promise(() => { })
        );

        render(<Analytics />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render analytics data successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText('Link Analytics')).toBeInTheDocument();
        });

        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should display visits table', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText('Recent Visits')).toBeInTheDocument();
        });

        expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
        expect(screen.getByText('Malaysia')).toBeInTheDocument();
        expect(screen.getByText('Singapore')).toBeInTheDocument();
    });

    it('should show error state when API fails', async () => {
        const errorResponse = {
            response: {
                data: { error: MESSAGES.errors.noDataFound },
            },
        };

        mockedAxios.get.mockRejectedValueOnce(errorResponse);
        mockedAxios.isAxiosError.mockReturnValue(true);

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText(new RegExp(`${MESSAGES.errors.noDataFound}`))).toBeInTheDocument();
        });
    });

    it('should fetch analytics with correct code', async () => {
        (navigation.useParams as jest.Mock).mockReturnValue({ code: 'test123' });
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

        render(<Analytics />);

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('/api/analytics/test123');
        });
    });

    it('should show "No visits yet" when there are no visits', async () => {
        const noVisitsData: AnalyticsData = {
            ...mockAnalyticsData,
            total_clicks: 0,
            visits: [],
        };

        mockedAxios.get.mockResolvedValueOnce({ data: noVisitsData });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText(new RegExp(`${MESSAGES.operations.noVisitData}`))).toBeInTheDocument();
        });
    });

    it('should display latest visit time', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText('Latest Visit')).toBeInTheDocument();
        });
    });

    it('should render back button', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

        render(<Analytics />);

        await waitFor(() => {
            const backButton = screen.getByRole('link', { name: new RegExp(`${MESSAGES.buttons.back}`) });
            expect(backButton).toBeInTheDocument();
            expect(backButton).toHaveAttribute('href', '/');
        });
    });
});