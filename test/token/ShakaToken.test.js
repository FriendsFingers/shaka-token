const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const { shouldBehaveLikeBaseToken } = require('./behaviours/BaseToken.behaviour');

const BigNumber = web3.BigNumber;

const ShakaToken = artifacts.require('ShakaToken');

contract('ShakaToken', function ([owner, anotherAccount, minter, operator, recipient, thirdParty]) {
  const _name = 'Shaka';
  const _symbol = 'HAK';
  const _decimals = 18;
  const _cap = new BigNumber(1000000);
  const _initialBalance = 1000;

  context('creating valid token', function () {
    describe('as a ERC20Capped', function () {
      it('requires a non-zero cap', async function () {
        await shouldFail.reverting(
          ShakaToken.new(_name, _symbol, _decimals, 0, { from: owner })
        );
      });
    });
  });

  context('testing behaviours', function () {
    beforeEach(async function () {
      this.token = await ShakaToken.new(_name, _symbol, _decimals, _cap, { from: owner });
    });

    shouldBehaveLikeBaseToken(
      [owner, anotherAccount, minter, operator, recipient, thirdParty],
      [_name, _symbol, _decimals, _cap, _initialBalance]
    );
  });
});
