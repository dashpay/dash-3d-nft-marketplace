// Direct execution test to verify coverage tracking
import { DashSDKError } from '../dash-sdk-src/utils/errors';

describe('Coverage Check', () => {
  it('should execute error class code', () => {
    const error = new DashSDKError('test');
    expect(error.message).toBe('test');
    expect(error.name).toBe('DashSDKError');
    expect(error).toBeInstanceOf(Error);
  });
});