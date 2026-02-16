import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@/app/(.*)$': '<rootDir>/app/$1',
        '^@/src/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/.next/**',
    ],
}

export default createJestConfig(config)