/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coverageDirectory: '.coverage',
  coverageReporters: ['text', 'json-summary', 'json'],
  collectCoverage: true
};