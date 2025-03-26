// これをしないと以下のエラーが出る。
// This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills
// 以下を参考にした。
// https://stackoverflow.com/questions/64558062/how-to-mock-resizeobserver-to-work-in-unit-tests-using-react-testing-library
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
