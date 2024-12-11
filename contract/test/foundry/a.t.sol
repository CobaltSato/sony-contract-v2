// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../../contracts/HeavenlyGuitarsGateway.sol";
import "../../contracts/tokens/HeavenlyGuitars.sol"; 
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";


contract HeavenlyGuitarsGatewayTest is Test {
    HeavenlyGuitarsGateway gateway;
    HeavenlyGuitars guitars;

    address admin = address(0x1);
    address operator = address(0x2);
    address user = address(0x3);
    address guitarProxy = address(0x4);

    function setUp() public {
        vm.startPrank(admin);
        
        // Deploy logic contract (implementation)
        HeavenlyGuitars implementation = new HeavenlyGuitars();

        // Deploy proxy contract
        bytes memory data = abi.encodeWithSelector(
            implementation.initialize.selector,
            "Heavenly Guitars",
            "HG",
            "https://base.uri/"
        );
        guitarProxy  = address(
            new TransparentUpgradeableProxy(
                address(implementation),
                admin,
                data
            )
        );

        guitars = HeavenlyGuitars(guitarProxy);

        //console.log(guitars.ownerOf(1));

        vm.stopPrank();

        // Deploy the Gateway contract
        gateway = new HeavenlyGuitarsGateway();
        vm.prank(admin);
        gateway.grantRole(gateway.DEFAULT_ADMIN_ROLE(), admin);
        gateway.grantRole(gateway.OPERATOR_ROLE(), operator);
    }

    function testSetERC721Addresses() public {
        vm.prank(admin);
        guitars.safeMint(user, 1); 
        assertEq(guitars.ownerOf(1), user);
    }

    /*
    function testSetERC721Addresses() public {
        uint256[] memory types;
        address[] memory addresses;

        types[0] = 1;
        addresses[0] = address(guitars);

        vm.prank(admin);
        gateway.setERC721Addresses(types, addresses);

        assertEq(gateway.erc721Addresses(1), address(guitars));
    }

    function testImportNfts() public {
        uint256;
        bytes;

        tokenIds[0] = 100;
        signatures[0] = abi.encodePacked(bytes32(0), bytes32(0), uint8(0));

        uint256 deadline = block.timestamp + 1000;

        vm.prank(admin);
        gateway.setERC721Addresses([1], [address(guitars)]);

        // NFTをユーザーからゲートウェイにインポート
        vm.prank(operator);
        gateway.importNfts(user, 1, tokenIds, "import-1", deadline, signatures);

        assertEq(gateway.erc721TokenImporters(address(guitars), 100), user);
    }

    function testExportNfts() public {
        uint256;

        tokenIds[0] = 100;

        vm.prank(admin);
        gateway.setERC721Addresses([1], [address(guitars)]);

        // インポート済みNFTをユーザーにエクスポート
        vm.prank(operator);
        gateway.exportNfts(user, 1, tokenIds, "export-1");

        // Mockコントラクトでのオーナーチェック
        assertEq(guitars.ownerOf(100), user);
    }

    function testRevertInvalidERC721Type() public {
        uint256;
        bytes;

        tokenIds[0] = 100;
        signatures[0] = abi.encodePacked(bytes32(0), bytes32(0), uint8(0));

        uint256 deadline = block.timestamp + 1000;

        vm.prank(operator);
        vm.expectRevert(HeavenlyGuitarsGateway.InvalidERC721Type.selector);
        gateway.importNfts(user, 1, tokenIds, "import-1", deadline, signatures);
    }

    function testRevertTransactionExpired() public {
        uint256;
        bytes;

        tokenIds[0] = 100;
        signatures[0] = abi.encodePacked(bytes32(0), bytes32(0), uint8(0));

        uint256 deadline = block.timestamp - 1;

        vm.prank(admin);
        gateway.setERC721Addresses([1], [address(guitars)]);

        vm.prank(operator);
        vm.expectRevert(HeavenlyGuitarsGateway.TransactionExpired.selector);
        gateway.importNfts(user, 1, tokenIds, "import-1", deadline, signatures);
    }

    function testRevertInvalidTokenIds() public {
        uint256;
        bytes;

        uint256 deadline = block.timestamp + 1000;

        vm.prank(admin);
        gateway.setERC721Addresses([1], [address(guitars)]);

        vm.prank(operator);
        vm.expectRevert(HeavenlyGuitarsGateway.InvalidTokenIds.selector);
        gateway.importNfts(user, 1, tokenIds, "import-1", deadline, signatures);
    }
    */
}
