const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

const { describe, it, beforeEach, afterEach, before, after } = require('mocha');

module.exports = {
    it,
    sinon,
    expect,
    describe,
    before,
    after,
    beforeEach,
    afterEach
};