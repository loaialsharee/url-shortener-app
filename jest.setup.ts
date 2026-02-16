import '@testing-library/jest-dom'

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockPrefetch = jest.fn()

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: mockPush,
        replace: mockReplace,
        prefetch: mockPrefetch,
        back: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    })),
    usePathname: jest.fn(() => '/'),
    useSearchParams: jest.fn(() => new URLSearchParams()),
    useParams: jest.fn(() => ({})),
}))

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
global.localStorage = localStorageMock as any

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})