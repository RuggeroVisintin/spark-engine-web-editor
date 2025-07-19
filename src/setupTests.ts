// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './__mocks__/fs-api.mock';
import './__mocks__/utils/image.mock';
import { TextEncoder } from 'text-encoding';

jest.disableAutomock();

global.TextEncoder = TextEncoder;

// jest.mock('@sparkengine')

// jest.mock('uuid', () => ({
//     v4: () => 'test-uuid'
// }))

