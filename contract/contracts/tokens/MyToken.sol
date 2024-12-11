// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyToken is Initializable, ERC20Upgradeable {
    function initialize() initializer public {
        __ERC20_init("MockToken", "MCK");
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}