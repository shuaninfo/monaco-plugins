/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  coverageProvider: 'v8',
  preset:'ts-jest',
  testMatch: ['**/*.spec.[jt]s?(x)'],
};
export default config
