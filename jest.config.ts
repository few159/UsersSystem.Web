// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
        // Suporte a imports absolutos: '@/...' para 'src/...'
        '^@/(.*)$': '<rootDir>/src/$1',
        // Suporte a imports de CSS/SCSS
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.jest.json',
            useESM: false
        }
    }
};
