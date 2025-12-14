import "@testing-library/jest-dom";

global.fetch = jest.fn() as unknown as typeof fetch;
