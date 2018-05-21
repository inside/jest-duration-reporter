module.exports = {
  verbose: false,
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  reporters: [
    ['../index.js', { threshold: 2000 }],
  ]
}
