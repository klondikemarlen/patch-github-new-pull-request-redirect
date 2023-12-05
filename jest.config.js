/** @type {import('jest').Config} */
const config = {
    testEnvironment: "jsdom",
    // Make jest as much like RSpec as possible, add these if I get confused when
    // testing with mocks.
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    resetModules: true,
}

module.exports = config
