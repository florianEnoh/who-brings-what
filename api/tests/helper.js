const sinon = require('sinon');
const { expect } = require('chai');
const server = require('server').BootStrapTestHelper();
const { describe, it, beforeEach, afterEach } = require('mocha');

module.exports = {
    it,
    sinon,
    server,
    expect,
    describe,
    beforeEach,
    afterEach
};