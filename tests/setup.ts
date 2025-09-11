import { jest, beforeEach, afterEach } from '@jest/globals';

/**
 * Mocks console methods to reduce noise in tests.
 *
 * @remarks
 * This should not be used when tests are specifically checking console output.
 */
const originalConsole = global.console;

beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
});

afterEach(() => {
  global.console = originalConsole;
});

/**
 * Increases timeout for integration tests.
 *
 * @remarks
 * Integration tests may take longer due to file system operations.
 */
jest.setTimeout(30000);