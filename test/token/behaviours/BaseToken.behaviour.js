const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const { shouldBehaveLikeERC20Mintable } = require('openzeppelin-solidity/test/token/ERC20/behaviors/ERC20Mintable.behavior'); // eslint-disable-line max-len
const { shouldBehaveLikeERC20Capped } = require('openzeppelin-solidity/test/token/ERC20/behaviors/ERC20Capped.behavior'); // eslint-disable-line max-len
const { shouldBehaveLikeERC20Burnable } = require('openzeppelin-solidity/test/token/ERC20/behaviors/ERC20Burnable.behavior'); // eslint-disable-line max-len
const { shouldBehaveLikeOwnable } = require('openzeppelin-solidity/test/ownership/Ownable.behavior');
const { shouldBehaveLikeERC1363 } = require('erc-payable-token/test/token/ERC1363/ERC1363.behaviour');
const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

const { shouldBehaveLikeERC20Detailed } = require('./ERC20Detailed.behaviour');
const { shouldBehaveLikeERC20 } = require('./ERC20.behaviour');
const { shouldBehaveLikeRemoveRole } = require('../../access/roles/RemoveRole.behavior');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeBaseToken (
  [owner, anotherAccount, minter, operator, recipient, thirdParty],
  [_name, _symbol, _decimals, _cap, _initialSupply]
) {
  context('like a ERC20Detailed', function () {
    shouldBehaveLikeERC20Detailed(_name, _symbol, _decimals);
  });

  context('like a ERC20Mintable', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: owner });
    });
    shouldBehaveLikeERC20Mintable(minter, [anotherAccount]);
  });

  context('like a ERC20Capped', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: owner });

      // NOTE: burning initial supply to test cap
      await this.token.burn(_initialSupply, { from: owner });
    });
    shouldBehaveLikeERC20Capped(minter, [anotherAccount], _cap);
  });

  context('like a ERC20Burnable', function () {
    shouldBehaveLikeERC20Burnable(owner, _initialSupply, [owner]);
  });

  context('like a ERC20', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: owner });
    });
    shouldBehaveLikeERC20([owner, anotherAccount, recipient], _initialSupply);
  });

  context('like a ERC1363', function () {
    shouldBehaveLikeERC1363([owner, anotherAccount, recipient], _initialSupply);
  });

  context('BaseToken token behaviours', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: owner });
      await this.token.addOperator(operator, { from: owner });

      await this.token.mint(thirdParty, _initialSupply, { from: minter });
    });

    context('before finish minting', function () {
      it('mintingFinished should be false', async function () {
        (await this.token.mintingFinished()).should.be.equal(false);
      });

      describe('if transfer are not enabled', function () {
        it('transferEnabled should be false', async function () {
          (await this.token.transferEnabled()).should.be.equal(false);
        });

        describe('if it is not an operator', function () {
          it('should fail transfer', async function () {
            await shouldFail.reverting(this.token.transfer(recipient, _initialSupply, { from: thirdParty }));
          });

          it('should fail transferFrom', async function () {
            await this.token.approve(anotherAccount, _initialSupply, { from: thirdParty });
            await shouldFail.reverting(
              this.token.transferFrom(thirdParty, recipient, _initialSupply, { from: anotherAccount })
            );
          });
        });

        describe('if it is an operator', function () {
          beforeEach(async function () {
            await this.token.addOperator(thirdParty, { from: owner });
          });

          it('should transfer', async function () {
            await this.token.transfer(thirdParty, _initialSupply, { from: thirdParty });
          });

          it('should transferFrom', async function () {
            await this.token.approve(anotherAccount, _initialSupply, { from: thirdParty });
            await this.token.transferFrom(thirdParty, recipient, _initialSupply, { from: anotherAccount });
          });
        });
      });

      describe('if transfer are enabled', function () {
        beforeEach(async function () {
          await this.token.enableTransfer({ from: owner });
        });

        it('transferEnabled should be true', async function () {
          (await this.token.transferEnabled()).should.be.equal(true);
        });

        describe('if it is not an operator', function () {
          it('should transfer', async function () {
            await this.token.transfer(thirdParty, _initialSupply, { from: thirdParty });
          });

          it('should transferFrom', async function () {
            await this.token.approve(anotherAccount, _initialSupply, { from: thirdParty });
            await this.token.transferFrom(thirdParty, recipient, _initialSupply, { from: anotherAccount });
          });
        });

        describe('if it is an operator', function () {
          beforeEach(async function () {
            await this.token.addOperator(thirdParty, { from: owner });
          });

          it('should transfer', async function () {
            await this.token.transfer(thirdParty, _initialSupply, { from: thirdParty });
          });

          it('should transferFrom', async function () {
            await this.token.approve(anotherAccount, _initialSupply, { from: thirdParty });
            await this.token.transferFrom(thirdParty, recipient, _initialSupply, { from: anotherAccount });
          });
        });
      });
    });

    context('after finish minting', function () {
      beforeEach(async function () {
        await this.token.finishMinting({ from: owner });
      });

      it('transferEnabled should be true', async function () {
        (await this.token.transferEnabled()).should.be.equal(true);
      });

      it('mintingFinished should be true', async function () {
        (await this.token.mintingFinished()).should.be.equal(true);
      });

      it('shouldn\'t mint more tokens', async function () {
        await shouldFail.reverting(this.token.mint(thirdParty, 1, { from: minter }));
      });
    });

    context('testing ownership', function () {
      beforeEach(async function () {
        this.ownable = this.token;
      });

      shouldBehaveLikeOwnable(owner, [thirdParty]);
    });

    context('testing remove roles', function () {
      beforeEach(async function () {
        this.contract = this.token;
      });

      describe('operator', function () {
        shouldBehaveLikeRemoveRole(owner, operator, [thirdParty], 'operator');
      });

      describe('minter', function () {
        shouldBehaveLikeRemoveRole(owner, minter, [thirdParty], 'minter');
      });
    });

    context('like a TokenRecover', function () {
      beforeEach(async function () {
        this.instance = this.token;
      });

      shouldBehaveLikeTokenRecover([owner, thirdParty]);
    });
  });
}

module.exports = {
  shouldBehaveLikeBaseToken,
};
