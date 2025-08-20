import { jest, beforeEach, afterEach } from '@jest/globals';

// Mock console methods to reduce noise in tests unless specifically testing them
const originalConsole = global.console;

beforeEach(() => {
  // Reset console mocks before each test
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
});

afterEach(() => {
  // Restore original console after each test
  global.console = originalConsole;
});

// Increase timeout for integration tests
jest.setTimeout(30000);