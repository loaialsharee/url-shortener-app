import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import History from '@/app/src/components/History';
import { ApiResponse } from '@/app/src/types/apiModels';
import { toast } from 'sonner';
import * as storage from '@/app/src/lib/storage';
import * as navigation from 'next/navigation';

jest.mock('sonner');
jest.mock('@/app/src/lib/storage');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockedToast = toast as jest.Mocked<typeof toast>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('History Component', () => {
    const mockUrls: ApiResponse[] = [
        {
            code: 'abc123',
            short_url: 'https://url-shortener-api-dv8v.onrender.com/abc123',
            target_url: 'https://example.com',
            title: 'Example Site',
        },
        {
            code: 'def456',
            short_url: 'https://url-shortener-api-dv8v.onrender.com/def456',
            target_url: 'https://test.com',
            title: 'Test Site',
        },
    ];

    const mockOnDelete = jest.fn();
    const mockPush = jest.fn();
    const writeTextMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (navigation.useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: writeTextMock,
            },
            writable: true,
            configurable: true,
        });
    });

    it('should return null when urls array is empty', () => {
        const { container } = render(<History urls={[]} onDelete={mockOnDelete} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render all URLs', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        expect(screen.getByText('https://url-shortener-api-dv8v.onrender.com/abc123')).toBeInTheDocument();
        expect(screen.getByText('https://url-shortener-api-dv8v.onrender.com/def456')).toBeInTheDocument();
        expect(screen.getByText('Example Site')).toBeInTheDocument();
        expect(screen.getByText('Test Site')).toBeInTheDocument();
    });

    it('should display "MY POCKET LINKS" header', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);
        expect(screen.getByText('MY POCKET LINKS')).toBeInTheDocument();
    });

    it('should render external link with correct href', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        const links = screen.getAllByRole('link');
        const externalLink = links[0];

        expect(externalLink).toHaveAttribute('href', 'https://url-shortener-api-dv8v.onrender.com/abc123');
        expect(externalLink).toHaveAttribute('target', '_blank');
        expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display target URLs correctly', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        expect(screen.getByText('https://example.com')).toBeInTheDocument();
        expect(screen.getByText('https://test.com')).toBeInTheDocument();
    });

    it('should render all action buttons for each URL', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(6);
    });

    it('should copy URL to clipboard when copy button is clicked', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        const allButtons = screen.getAllByRole('button');
        const copyButton = allButtons[0];

        fireEvent.click(copyButton);

        expect(writeTextMock).toHaveBeenCalledWith('https://url-shortener-api-dv8v.onrender.com/abc123');
        expect(mockedToast.success).toHaveBeenCalled();
    });

    it('should call onDelete when delete button is clicked', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        const allButtons = screen.getAllByRole('button');
        const deleteButton = allButtons[2];

        fireEvent.click(deleteButton);

        expect(mockedStorage.deleteUrl).toHaveBeenCalledWith(
            'https://url-shortener-api-dv8v.onrender.com/abc123'
        );
        expect(mockOnDelete).toHaveBeenCalledWith('https://url-shortener-api-dv8v.onrender.com/abc123');
    });

    it('should navigate to analytics when analytics button is clicked', () => {
        render(<History urls={mockUrls} onDelete={mockOnDelete} />);

        const allButtons = screen.getAllByRole('button');
        const analyticsButton = allButtons[1];

        fireEvent.click(analyticsButton);

        expect(mockPush).toHaveBeenCalledWith('/analytics/abc123');
    });
});