const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');
const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent');

require('chai')
  .should();

function capitalize (str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function shouldBehaveLikeRemoveRole (authorized, otherAuthorized, [anyone], rolename) {
  rolename = capitalize(rolename);

  describe('should behave like public role', function () {
    beforeEach('check preconditions', async function () {
      (await this.contract[`is${rolename}`](authorized)).should.equal(true);
      (await this.contract[`is${rolename}`](otherAuthorized)).should.equal(true);
      (await this.contract[`is${rolename}`](anyone)).should.equal(false);
    });

    describe('remove', function () {
      it('removes role from an already assigned account', async function () {
        await this.contract[`remove${rolename}`](otherAuthorized, { from: authorized });
        (await this.contract[`is${rolename}`](authorized)).should.equal(true);
        (await this.contract[`is${rolename}`](otherAuthorized)).should.equal(false);
      });

      it(`emits a ${rolename}Removed event`, async function () {
        const { logs } = await this.contract[`remove${rolename}`](otherAuthorized, { from: authorized });
        expectEvent.inLogs(logs, `${rolename}Removed`, { account: otherAuthorized });
      });

      it('reverts when removing from an unassigned account', async function () {
        await shouldFail.reverting(this.contract[`remove${rolename}`](anyone, { from: authorized }));
      });

      it('reverts when removing role from the null account', async function () {
        await shouldFail.reverting(this.contract[`remove${rolename}`](ZERO_ADDRESS, { from: authorized }));
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeRemoveRole,
};
