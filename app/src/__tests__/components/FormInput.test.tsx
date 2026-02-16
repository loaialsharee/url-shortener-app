import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import FormInput from '@/app/src/components/FormInput';
import { toast } from 'sonner';
import * as storage from '@/app/src/lib/storage';
import { MESSAGES } from '../../lib/messages';

jest.mock('axios');
jest.mock('sonner');
jest.mock('@/app/src/lib/storage');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('FormInput Component', () => {
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the form with input and button', () => {
        render(<FormInput onSuccess={mockOnSuccess} />);

        expect(screen.getByPlaceholderText(new RegExp(`${MESSAGES.placeholders.enterUrl}`))).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should disable button when input is empty', () => {
        render(<FormInput onSuccess={mockOnSuccess} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should enable button when input has value', async () => {
        const user = userEvent.setup();
        render(<FormInput onSuccess={mockOnSuccess} />);

        const input = screen.getByPlaceholderText(new RegExp(`${MESSAGES.placeholders.enterUrl}`));
        await user.type(input, 'https://example.com');

        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });

    it('should submit form successfully', async () => {
        const user = userEvent.setup();
        const mockResponse = {
            data: {
                code: 'abc123',
                short_url: 'https://url-shortener-api-dv8v.onrender.com/abc123',
                target_url: 'https://example.com',
                title: 'Example Site',
            },
        };

        mockedAxios.post.mockResolvedValueOnce(mockResponse);
        mockedStorage.storeUrl.mockReturnValue(true);

        render(<FormInput onSuccess={mockOnSuccess} />);

        const input = screen.getByPlaceholderText(new RegExp(`${MESSAGES.placeholders.enterUrl}`));
        const button = screen.getByRole('button');

        await user.type(input, 'https://example.com');
        await user.click(button);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/shorten',
                { target_url: 'https://example.com' }
            );
        });

        expect(mockedStorage.storeUrl).toHaveBeenCalledWith(mockResponse.data);
        expect(mockedToast.success).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should handle API error', async () => {
        const user = userEvent.setup();
        const errorResponse = {
            response: {
                data: { error: 'Invalid URL' },
            },
        };

        mockedAxios.post.mockRejectedValueOnce(errorResponse);
        mockedAxios.isAxiosError.mockReturnValue(true);

        render(<FormInput onSuccess={mockOnSuccess} />);

        const input = screen.getByPlaceholderText(new RegExp(`${MESSAGES.placeholders.enterUrl}`));
        const button = screen.getByRole('button');

        await user.type(input, 'invalid-url');
        await user.click(button);

        await waitFor(() => {
            expect(mockedToast.error).toHaveBeenCalled();
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});