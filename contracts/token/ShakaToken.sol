pragma solidity ^0.4.25;

import "./BaseToken.sol";

/**
 * @title ShakaToken
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation of the Shaka Token
 */
contract ShakaToken is BaseToken {

  /**
   * @param name Name of the token
   * @param symbol A symbol to be used as ticker
   * @param decimals Number of decimals. All the operations are done using the smallest and indivisible token unit
   * @param cap Maximum number of tokens mintable
   */
  constructor(
    string name,
    string symbol,
    uint8 decimals,
    uint256 cap
  )
    BaseToken(name, symbol, decimals, cap)
    public
  {}
}
