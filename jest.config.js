/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/src/test/**/?(*.)+(spec|test).[jt]s?(x)"],
};