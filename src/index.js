const identity = x => x;
const guard = (condition, message) => {
    if (condition) {
        throw new Error(message);
    }
};
const guardAgainstNotAFunction = (func, message) => {
    guard(typeof func !== 'function', message);
};

export const OK = 'RESULT_OK';
export const ERROR = 'RESULT_ERROR';

class Result {
    constructor(type, errorOrData) {
        guard(type !== OK && type !== ERROR, `Unknown type: ${type}.`);

        this.type = type;

        if (type === OK) {
            this.data = errorOrData;
        }
        if (type === ERROR) {
            this.error = errorOrData;
        }
    }

    match(errHandler, okHandler) {
        guardAgainstNotAFunction(errHandler, 'Error handler should be a function');
        guardAgainstNotAFunction(okHandler, 'Ok handler should be a function');

        const type = this.type;

        if (type === ERROR) {
            return errHandler(this.error);
        }
        if (type === OK) {
            return okHandler(this.data);
        }
    }

    unwrap() {
        return this.match(error => { throw error; }, identity);
    }

    catch() {
        return this.match(identity, () => { throw new Error('Result is ok'); });
    }
}

export const ok = data => new Result(OK, data);
export const err = e => new Result(ERROR, e);
