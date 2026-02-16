import { getUrls, storeUrl, deleteUrl } from '@/app/src/lib/storage';
import { ApiResponse } from '@/app/src/types/apiModels';

const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('Storage utilities', () => {
    const mockUrl: ApiResponse = {
        code: 'abc123',
        short_url: 'https://url-shortener-api-dv8v.onrender.com/abc123',
        target_url: 'https://example.com',
        title: 'Example Site',
    };

    const mockUrl2: ApiResponse = {
        code: 'def456',
        short_url: 'https://url-shortener-api-dv8v.onrender.com/def456',
        target_url: 'https://test.com',
        title: 'Test Site',
    };

    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    describe('getUrls', () => {
        it('should return empty array when localStorage is empty', () => {
            const urls = getUrls();
            expect(urls).toEqual([]);
        });

        it('should return stored URLs from localStorage', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl]));
            const urls = getUrls();
            expect(urls).toEqual([mockUrl]);
        });

        it('should return empty array when localStorage data is invalid', () => {
            localStorageMock.setItem('pocket-urls', 'invalid json');
            const urls = getUrls();
            expect(urls).toEqual([]);
        });

        it('should return multiple URLs', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl, mockUrl2]));
            const urls = getUrls();
            expect(urls).toHaveLength(2);
            expect(urls).toEqual([mockUrl, mockUrl2]);
        });
    });

    describe('storeUrl', () => {
        it('should store a new URL in localStorage', () => {
            const result = storeUrl(mockUrl);

            expect(result).toBe(true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'pocket-urls',
                JSON.stringify([mockUrl])
            );
        });

        it('should add new URL at the beginning of the array', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl2]));

            storeUrl(mockUrl);

            const urls = getUrls();
            expect(urls[0]).toEqual(mockUrl);
            expect(urls[1]).toEqual(mockUrl2);
        });

        it('should not store duplicate URLs with same code', () => {
            storeUrl(mockUrl);
            const result = storeUrl(mockUrl);

            expect(result).toBe(false);
            const urls = getUrls();
            expect(urls).toHaveLength(1);
        });

        it('should store multiple different URLs', () => {
            storeUrl(mockUrl);
            storeUrl(mockUrl2);

            const urls = getUrls();
            expect(urls).toHaveLength(2);
        });
    });

    describe('deleteUrl', () => {
        it('should delete URL by short_url', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl, mockUrl2]));

            deleteUrl(mockUrl.short_url);

            const urls = getUrls();
            expect(urls).toHaveLength(1);
            expect(urls[0]).toEqual(mockUrl2);
        });

        it('should handle deleting non-existent URL', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl]));

            deleteUrl('https://non-existent-url.com');

            const urls = getUrls();
            expect(urls).toHaveLength(1);
        });

        it('should update localStorage after deletion', () => {
            localStorageMock.setItem('pocket-urls', JSON.stringify([mockUrl, mockUrl2]));

            deleteUrl(mockUrl.short_url);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'pocket-urls',
                JSON.stringify([mockUrl2])
            );
        });
    });
});