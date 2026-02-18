export const MESSAGES = {
    errors: {
        invalidUrl: 'Invalid URL format',
        shortenFailed: 'Failed to shorten URL!',
        analyticsFailed: 'Failed to fetch analytics!',
        unexpectedError: 'An unexpected error occurred',
        noDataFound: 'No data found!'
    },
    success: {
        urlShortened: 'URL shortened successfully! 🎉',
        copied: 'Short URL copied to clipboard!'
    },
    buttons: {
        shorten: 'Shorten',
        back: 'Back',
        refresh: 'Refresh'
    },
    placeholders: {
        enterUrl: 'Paste your long URL here...'
    },
    operations: {
        loading: 'Loading analytics...',
        noVisitData: 'No visit data yet.',
        noVisit: 'No visits yet'
    },
    titles: {
        linkAnalytics: 'Link Analytics',
        totalClicks: 'Total Clicks',
        countries: 'Countries',
        latestVisit: 'Latest Visit',
        recentVisits: 'Recent Visits'
    }
} as const;
