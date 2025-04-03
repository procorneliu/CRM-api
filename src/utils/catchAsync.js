// A function that makes easier to use try-catch block for asynchronous code
// Automatically puts function in try-catch and returns that function
export default (fn) => (req, res, next) => fn(req, res, next).catch(next);
