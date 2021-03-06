pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";
import "eth-token-recover/contracts/TokenRecover.sol";
import "../access/roles/OperatorRole.sol";

/**
 * @title BaseToken
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation of the BaseToken
 */
contract BaseToken is ERC20Detailed, ERC20Capped, ERC20Burnable, ERC1363, OperatorRole, TokenRecover {

  event MintFinished();
  event TransferEnabled();

  // indicates if minting is finished
  bool private _mintingFinished = false;

  // indicates if transfer is enabled
  bool private _transferEnabled = false;

  /**
   * @dev Tokens can be minted only before minting finished
   */
  modifier canMint() {
    require(!_mintingFinished);
    _;
  }

  /**
   * @dev Tokens can be moved only after if transfer enabled or if you are an approved operator
   */
  modifier canTransfer(address from) {
    require(_transferEnabled || isOperator(from));
    _;
  }

  /**
   * @param name Name of the token
   * @param symbol A symbol to be used as ticker
   * @param decimals Number of decimals. All the operations are done using the smallest and indivisible token unit
   * @param cap Maximum number of tokens mintable
   * @param initialSupply Initial token supply
   */
  constructor(
    string name,
    string symbol,
    uint8 decimals,
    uint256 cap,
    uint256 initialSupply
  )
    ERC20Detailed(name, symbol, decimals)
    ERC20Capped(cap)
    public
  {
    if (initialSupply > 0) {
      _mint(owner(), initialSupply);
    }
  }

  /**
   * @return if minting is finished or not
   */
  function mintingFinished() public view returns (bool) {
    return _mintingFinished;
  }

  /**
   * @return if transfer is enabled or not
   */
  function transferEnabled() public view returns (bool) {
    return _transferEnabled;
  }

  function mint(address to, uint256 value) public canMint returns (bool) {
    return super.mint(to, value);
  }

  function transfer(address to, uint256 value) public canTransfer(msg.sender) returns (bool) {
    return super.transfer(to, value);
  }

  function transferFrom(address from, address to, uint256 value) public canTransfer(from) returns (bool) {
    return super.transferFrom(from, to, value);
  }

  /**
   * @dev Function to stop minting new tokens
   */
  function finishMinting() public onlyOwner canMint {
    _mintingFinished = true;
    _transferEnabled = true;

    emit MintFinished();
    emit TransferEnabled();
  }

  /**
 * @dev Function to enable transfers.
 */
  function enableTransfer() public onlyOwner {
    _transferEnabled = true;

    emit TransferEnabled();
  }

  /**
   * @dev remove the `operator` role from address
   * @param account Address you want to remove role
   */
  function removeOperator(address account) public onlyOwner {
    _removeOperator(account);
  }

  /**
   * @dev remove the `minter` role from address
   * @param account Address you want to remove role
   */
  function removeMinter(address account) public onlyOwner {
    _removeMinter(account);
  }
}
