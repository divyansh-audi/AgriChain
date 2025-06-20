// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {WeatherTriggeredInsurance} from "src/WeatherTriggeredInsurance.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {DeployWeatherTriggeredInsurance} from "script/DeployWeatherTriggeredInsurance.s.sol";
import {DeployFarmerNFT} from "script/DeployFarmerNFT.s.sol";
import {FarmerNFT} from "../../src/FarmerNFT.sol";

contract TestWTI is Test {
    WeatherTriggeredInsurance public weatherTI;
    HelperConfig public helperConfig;
    FarmerNFT public farmerNFT;
    address router;
    bytes32 donId;
    uint32 gasLimit;
    uint64 subscriptionId;
    string sourceString;

    address public ALICE = makeAddr("alice");
    address public BOB = makeAddr("bob");
    uint256 public constant BALANCE = 10 ether;
    uint256 public constant INSURANCE_FEE = 1 ether;

    function setUp() external {
        DeployFarmerNFT deployfarmerNFT = new DeployFarmerNFT();
        DeployWeatherTriggeredInsurance deployWTI = new DeployWeatherTriggeredInsurance();
        farmerNFT = deployfarmerNFT.run();
        (weatherTI, helperConfig) = deployWTI.run();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        router = config.router;
        donId = config.donId;
        gasLimit = config.gasLimit;
        subscriptionId = config.subscriptionId;
        sourceString = config.sourceString;
        vm.deal(ALICE, BALANCE);
        vm.deal(BOB, BALANCE);
    }

    function testRevertsWhenTakeInsuranceWithoutMintingFarmerNFT() public {
        vm.prank(ALICE);
        // vm.expectRevert(WeatherTriggeredInsurance.WeatherTriggeredInsurance__FarmerNFTNotMinted.selector);
        vm.expectRevert();
        weatherTI.getInsurance{value: INSURANCE_FEE}(BOB, "Jaipur");
    }

    function testRevertsWhenLowFunding() public {
        vm.startPrank(ALICE);
        farmerNFT.mintNft("sadsfsdas");
        vm.expectRevert(WeatherTriggeredInsurance.WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance.selector);
        weatherTI.getInsurance{value: 0.0001 ether}(BOB, "Jaipur");
        vm.stopPrank();
    }
}
