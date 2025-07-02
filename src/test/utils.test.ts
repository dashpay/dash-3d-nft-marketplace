// Tests for utils module
import { 
  DashSDKError, 
  ValidationError, 
  NetworkError,
  InitializationError,
  StateTransitionError,
  NotFoundError,
  InsufficientBalanceError,
  TimeoutError
} from '../dash-sdk-src/utils/errors';

describe('Utils - Error Classes', () => {
  describe('DashSDKError', () => {
    it('should create error with message', () => {
      const error = new DashSDKError('Test error message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('DashSDKError');
    });

    it('should have proper stack trace', () => {
      const error = new DashSDKError('Stack trace test');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('DashSDKError');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid input');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection failed');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Connection failed');
      expect(error.name).toBe('NetworkError');
    });
  });

  describe('InitializationError', () => {
    it('should create initialization error', () => {
      const error = new InitializationError('SDK not initialized');
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('SDK not initialized');
      expect(error.name).toBe('InitializationError');
    });
  });

  describe('StateTransitionError', () => {
    it('should create state transition error with code', () => {
      const error = new StateTransitionError('Transition failed', 1001);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('Transition failed');
      expect(error.code).toBe(1001);
      expect(error.name).toBe('StateTransitionError');
    });

    it('should handle different error codes', () => {
      const errors = [
        new StateTransitionError('Invalid signature', 2001),
        new StateTransitionError('Insufficient funds', 3001),
        new StateTransitionError('Rate limited', 4001),
      ];

      expect(errors[0].code).toBe(2001);
      expect(errors[1].code).toBe(3001);
      expect(errors[2].code).toBe(4001);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with resource and id', () => {
      const error = new NotFoundError('Identity', 'abc123');
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('Identity with ID abc123 not found');
      expect(error.name).toBe('NotFoundError');
    });

    it('should handle different resource types', () => {
      const identityError = new NotFoundError('Identity', '123');
      const contractError = new NotFoundError('Contract', '456');
      const documentError = new NotFoundError('Document', '789');

      expect(identityError.message).toContain('Identity');
      expect(contractError.message).toContain('Contract');
      expect(documentError.message).toContain('Document');
    });
  });

  describe('InsufficientBalanceError', () => {
    it('should create insufficient balance error', () => {
      const error = new InsufficientBalanceError(1000000, 500000);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('Insufficient balance. Required: 1000000, available: 500000');
      expect(error.name).toBe('InsufficientBalanceError');
    });

    it('should handle zero balance', () => {
      const error = new InsufficientBalanceError(100, 0);
      expect(error.message).toContain('Required: 100');
      expect(error.message).toContain('available: 0');
    });
  });

  describe('TimeoutError', () => {
    it('should create timeout error', () => {
      const error = new TimeoutError('State transition broadcast', 30000);
      expect(error).toBeInstanceOf(DashSDKError);
      expect(error.message).toBe('State transition broadcast timed out after 30000ms');
      expect(error.name).toBe('TimeoutError');
    });

    it('should handle different operations', () => {
      const broadcastError = new TimeoutError('Broadcast', 5000);
      const fetchError = new TimeoutError('Fetch identity', 10000);
      const waitError = new TimeoutError('Wait for confirmation', 60000);

      expect(broadcastError.message).toContain('Broadcast');
      expect(fetchError.message).toContain('Fetch identity');
      expect(waitError.message).toContain('Wait for confirmation');
    });
  });

  describe('Error Inheritance', () => {
    it('all custom errors should extend DashSDKError', () => {
      const errors = [
        new ValidationError('test'),
        new NetworkError('test'),
        new InitializationError('test'),
        new StateTransitionError('test', 1),
        new NotFoundError('test', '1'),
        new InsufficientBalanceError(1, 0),
        new TimeoutError('test', 1000),
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(DashSDKError);
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
});