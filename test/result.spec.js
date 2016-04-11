import { expect } from 'chai';
import * as Result from '../src';

const noop = () => {};

describe('Result type', function() {
    describe('match', function() {
        it('throws if no error handler given', function() {
            const resultObj = Result.err(new Error('boom'));
            const thunk = () => resultObj.match();
            expect(thunk).to.throw(Error, 'Error handler should be a function');
        });

        it('throws if no error handler is not a function', function() {
            const resultObj = Result.err(new Error('boom'));
            const thunk = () => resultObj.match('Not a function');
            expect(thunk).to.throw(Error, 'Error handler should be a function');
        });

        it('throws if no ok handler given', function() {
            const resultObj = Result.err(new Error('boom'));
            const thunk = () => resultObj.match(noop);
            expect(thunk).to.throw(Error, 'Ok handler should be a function');
        });

        it('throws if no ok handler is not a function', function() {
            const resultObj = Result.err(new Error('boom'));
            const thunk = () => resultObj.match(noop, 'Not a function');
            expect(thunk).to.throw(Error, 'Ok handler should be a function');
        });

        it('matches error', function() {
            const resultObj = Result.err(new Error('boom'));
            const result = resultObj.match(err => err.message, noop);
            expect(result).to.equal('boom');
        });

        it('matches ok', function() {
            const resultObj = Result.ok('Everything is ok');
            const result = resultObj.match(noop, data => data);
            expect(result).to.equal('Everything is ok');
        });
    });

    describe('unwrap', function() {
        it('throws for error result', function() {
            const resultObj = Result.err(new Error('boom'));
            const thunk = () => resultObj.unwrap();
            expect(thunk).to.throw(Error, 'boom');
        });

        it('returns data for ok result', function() {
            const resultObj = Result.ok('Everything is ok');
            const result = resultObj.unwrap();
            expect(result).to.equal('Everything is ok');
        });
    });

    describe('catch', function() {
        it('throws for ok result', function() {
            const resultObj = Result.ok();
            const thunk = () => resultObj.catch();
            expect(thunk).to.throw(Error, 'Result is ok');
        });

        it('returns error for error result', function() {
            const resultObj = Result.err(new Error('boom'));
            const result = resultObj.catch();
            expect(result).to.be.an.instanceof(Error);
            expect(result.message).to.equal('boom');
        });
    });
});
