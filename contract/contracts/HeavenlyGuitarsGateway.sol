// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IHeavenlyGuitars} from "./interfaces/IHeavenlyGuitars.sol";

contract HeavenlyGuitarsGateway is ERC721Holder, AccessControl, ReentrancyGuard {
    /* Event */
    event NftImported(address from, uint256 erc721Type, uint256[] tokenIds, string id);
    event NftExported(address to, uint256 erc721Type, uint256[] tokenIds, string id);
    event ERC721AddressesSet(uint256 indexed erc721Type, address erc721Address); 

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /* State variable */
    mapping(uint256 => address) public erc721Addresses;
    mapping(address => mapping(uint256 => address)) public erc721TokenImporters;

    enum TransferStatus { DEFAULT, SUCCESS, FAIL, CANCELLED }
    mapping(bytes32 => TransferStatus) public transferStatuses;

    error ArrayLengthMismatch();
    error InvalidERC721Type();
    error InvalidTokenIds();
    error InvalidReceiverAddress();
    error TransactionExpired();
    error ArgumentsLengthMismatch();
    error InvalidImporter();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(OPERATOR_ROLE, _msgSender());
    }

    /* Management function */
    function setERC721Addresses(uint256[] calldata erc721Types_, address[] calldata erc721Addresses_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (erc721Types_.length != erc721Addresses_.length) revert ArrayLengthMismatch();
        for (uint256 i = 0; i < erc721Types_.length; ) {
            erc721Addresses[erc721Types_[i]] = erc721Addresses_[i];
            emit ERC721AddressesSet(erc721Types_[i], erc721Addresses_[i]); 
            unchecked {
                i += 1;
            }
        }
    }

    function importNfts(
        address from_,
        uint256 erc721Type_,
        uint256[] calldata tokenIds_,
        string calldata id_,
        uint256 deadline,
        bytes[] calldata signatures
    ) external onlyRole(OPERATOR_ROLE) {
        if (block.timestamp > deadline) revert TransactionExpired();
        if (signatures.length != tokenIds_.length) revert ArgumentsLengthMismatch();
        address erc721Address = erc721Addresses[erc721Type_];
        if (erc721Address == address(0)) revert InvalidERC721Type();
        if (tokenIds_.length == 0) revert InvalidTokenIds();
        _processBatch(from_, erc721Address, tokenIds_.length, deadline, tokenIds_, signatures);
        emit NftImported(from_, erc721Type_, tokenIds_, id_);
    }

    function _processBatch(
        address from_,
        address erc721Address,
        uint256 batchSize,
        uint256 deadline,
        uint256[] calldata tokenIds,
        bytes[] calldata signatures
    ) private {
        IHeavenlyGuitars erc721Contract = IHeavenlyGuitars(erc721Address);

        for (uint256 i = 0; i < batchSize; ) {
            uint256 tokenId = tokenIds[i];
            erc721TokenImporters[erc721Address][tokenId] = from_;
            erc721Contract.safeTransferFromWithPermit(from_, address(this), tokenId, deadline, signatures[i]);
            unchecked {
                i += 1;
            }
        }
    }

    function exportNfts(
        address to_,
        uint256 erc721Type_,
        uint256[] calldata tokenIds_,
        string calldata id_
    ) external nonReentrant onlyRole(OPERATOR_ROLE) {
        address erc721Address = erc721Addresses[erc721Type_];
        if (erc721Address == address(0)) revert InvalidERC721Type();
        if (to_ == address(0)) revert InvalidReceiverAddress();
        if (tokenIds_.length == 0) revert InvalidTokenIds();

        IHeavenlyGuitars erc721Contract = IHeavenlyGuitars(erc721Address);
        for (uint256 i = 0; i < tokenIds_.length; ) {
            uint256 tokenId = tokenIds_[i];
            address importor = erc721TokenImporters[erc721Address][tokenId];
            // TO: importorをなくしたい
            if (importor == address(0)) {
                erc721Contract.safeMint(to_, tokenId);
            } else if (importor == to_) {
                erc721Contract.safeTransferFrom(address(this), to_, tokenId);
                delete erc721TokenImporters[erc721Address][tokenId];
            } else {
                revert InvalidImporter();
            }
            unchecked {
                i += 1;
            }
        }

        emit NftExported(to_, erc721Type_, tokenIds_, id_);
    }
}

