
module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    modulePathIgnorePatterns: ["dist/"],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testSequencer: "./src/tests/testSequencer.js",
    // testSequencer: "./testSequencer.js",
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },

};

