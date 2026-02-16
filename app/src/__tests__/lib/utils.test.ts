import { getRelativeTime } from '@/app/src/lib/utils';

describe('Utils', () => {
    describe('getRelativeTime', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-02-15T12:00:00Z'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should return "Just now" for very recent times', () => {
            const date = new Date('2026-02-15T11:59:30Z').toISOString();
            expect(getRelativeTime(date)).toBe('Just now');
        });

        it('should return minutes ago for times within an hour', () => {
            const date = new Date('2026-02-15T11:45:00Z').toISOString();
            expect(getRelativeTime(date)).toBe('15m ago');
        });

        it('should return hours ago for times within a day', () => {
            const date = new Date('2026-02-15T09:00:00Z').toISOString();
            expect(getRelativeTime(date)).toBe('3h ago');
        });

        it('should return days ago for older times', () => {
            const date = new Date('2026-02-13T12:00:00Z').toISOString();
            expect(getRelativeTime(date)).toBe('2d ago');
        });

        it('should handle 1 minute correctly', () => {
            const date = new Date('2026-02-15T11:59:00Z').toISOString();
            expect(getRelativeTime(date)).toBe('1m ago');
        });

        it('should handle 1 hour correctly', () => {
            const date = new Date('2026-02-15T11:00:00Z').toISOString();
            expect(getRelativeTime(date)).toBe('1h ago');
        });
    });
});