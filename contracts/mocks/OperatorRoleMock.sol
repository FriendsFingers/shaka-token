pragma solidity ^0.4.25;

import "../access/roles/OperatorRole.sol";

contract OperatorRoleMock is OperatorRole {
  function removeOperator(address account) public {
    _removeOperator(account);
  }

  function onlyOperatorMock() public view onlyOperator {}
}
