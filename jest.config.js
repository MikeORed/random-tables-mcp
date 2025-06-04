module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.test.ts'],
  moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
  "^@adapters/(.*)$": "<rootDir>/src/adapters/$1",
  "^@adapters-primary/(.*)$": "<rootDir>/src/adapters/primary/$1",
  "^@adapters-primary-mcp/(.*)$": "<rootDir>/src/adapters/primary/mcp/$1",
  "^@adapters-secondary/(.*)$": "<rootDir>/src/adapters/secondary/$1",
  "^@adapters-secondary-persistence/(.*)$": "<rootDir>/src/adapters/secondary/persistence/$1",
  "^@adapters-secondary-rng/(.*)$": "<rootDir>/src/adapters/secondary/rng/$1",
  "^@domain/(.*)$": "<rootDir>/src/domain/$1",
  "^@domain-entities/(.*)$": "<rootDir>/src/domain/entities/$1",
  "^@domain-valueObjects/(.*)$": "<rootDir>/src/domain/valueObjects/$1",
  "^@ports/(.*)$": "<rootDir>/src/ports/$1",
  "^@ports-primary/(.*)$": "<rootDir>/src/ports/primary/$1",
  "^@ports-secondary/(.*)$": "<rootDir>/src/ports/secondary/$1",
  "^@useCases/(.*)$": "<rootDir>/src/useCases/$1",
  "^@useCases-implementations/(.*)$": "<rootDir>/src/useCases/implementations/$1",
  "^@test/(.*)$": "<rootDir>/test/$1"
}
};
