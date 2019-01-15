const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const { shouldBehaveLikeBaseToken } = require('./behaviours/BaseToken.behaviour');

const BigNumber = web3.BigNumber;

const ShakaToken = artifacts.require('ShakaToken');

contract('ShakaToken', function ([owner, anotherAccount, minter, operator, recipient, thirdParty]) {
  const _name = 'Shaka';
  const _symbol = 'HAK';
  const _decimals = 18;
  const _cap = new BigNumber(200000000);
  const _initialSupply = 100000000;

  context('creating valid token', function () {
    describe('as a ERC20Capped', function () {
      it('requires a non-zero cap', async function () {
        await shouldFail.reverting(
          ShakaToken.new(_name, _symbol, _decimals, 0, _initialSupply, { from: owner })
        );
      });
    });

    describe('as a BaseToken', function () {
      describe('without initial supply', function () {
        beforeEach(async function () {
          this.token = await ShakaToken.new(_name, _symbol, _decimals, _cap, 0, { from: owner });
        });

        describe('once deployed', function () {
          it('total supply should be equal to zero', async function () {
            (await this.token.totalSupply()).should.be.bignumber.equal(0);
          });

          it('owner balance should be equal to zero', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(0);
          });
        });
      });

      describe('with initial supply', function () {
        beforeEach(async function () {
          this.token = await ShakaToken.new(_name, _symbol, _decimals, _cap, _initialSupply, { from: owner });
        });

        describe('once deployed', function () {
          it('total supply should be equal to initial supply', async function () {
            (await this.token.totalSupply()).should.be.bignumber.equal(_initialSupply);
          });

          it('owner balance should be equal to initial supply', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(_initialSupply);
          });
        });
      });
    });
  });

  context('like a BaseToken', function () {
    beforeEach(async function () {
      this.token = await ShakaToken.new(_name, _symbol, _decimals, _cap, _initialSupply, { from: owner });
    });

    shouldBehaveLikeBaseToken(
      [owner, anotherAccount, minter, operator, recipient, thirdParty],
      [_name, _symbol, _decimals, _cap, _initialSupply]
    );
  });
});
