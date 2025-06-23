// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721} from "forge-std/interfaces/IERC721.sol";
import {console} from "forge-std/console.sol";
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
    address mostRecentDeployed;

    address public ALICE = makeAddr("alice");
    address public BOB = makeAddr("bob");
    uint256 public constant BALANCE = 10 ether;
    uint256 public constant INSURANCE_FEE = 1 ether;
    string public constant DEFAULT_FARMER_JSON_URL = "ipfs://QmcQb1rrDzbtPxyBMyqbGeqaG4N7PCnmw5P81eR4Wj4uqG";

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
        mostRecentDeployed = config.mostRecentDeployed;
        vm.deal(ALICE, BALANCE);
        vm.deal(BOB, BALANCE);
    }

    // function testRevertsWhenTakeInsuranceWithoutMintingFarmerNFT() public {
    //     vm.startPrank(BOB);
    //     console.log("address of most recent contract", mostRecentDeployed);
    //     console.log("address of IERC721:", address(IERC721(mostRecentDeployed)));
    //     console.log("address of FARMERNTF(MOSTRD):", address(FarmerNFT(mostRecentDeployed)));
    //     console.log("address of farmerNFT", address(farmerNFT));
    //     farmerNFT.mintNft(DEFAULT_FARMER_JSON_URL);
    //     console.log("balanceof", FarmerNFT(mostRecentDeployed).balanceOf(msg.sender));
    //     console.log("BALANCE OF", farmerNFT.balanceOf(msg.sender));
    //     // vm.expectRevert(WeatherTriggeredInsurance.WeatherTriggeredInsurance__FarmerNFTNotMinted.selector);
    //     weatherTI.getInsurance{value: INSURANCE_FEE}("Jaipur");
    //     vm.stopPrank();
    // }

    function testRevertsWhenLowFunding() public {
        vm.startPrank(BOB);
        farmerNFT.mintNft("sadsfsdas");
        vm.expectRevert(WeatherTriggeredInsurance.WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance.selector);
        weatherTI.getInsurance{value: 0.0001 ether}("Jaipur");
        vm.stopPrank();
    }

    function testPassesEvenWithoutMinting() public {
        vm.prank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
    }

    function testStateVariablesAreProperlyUpdating() public {
        vm.prank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
        assert(weatherTI.getInsuranceUsers()[0] == BOB);
        assert(weatherTI.getInsurancePeriod(BOB) == weatherTI.getTimePeriodBasedOnFundingProvided(0.001 ether));
        assert(keccak256(abi.encodePacked(weatherTI.getFarmerLocation(BOB))) == keccak256(abi.encodePacked("Jaipur")));
    }

    function testInsuranceListIsUpdating() public {
        vm.prank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
        vm.prank(ALICE);
        weatherTI.getInsurance{value: 0.002 ether}("Udaipur");
        assert(weatherTI.getInsuranceUsers()[0] == BOB);
        assert(weatherTI.getInsuranceUsers()[1] == ALICE);
        assert(weatherTI.getInsurancePeriod(BOB) == weatherTI.getTimePeriodBasedOnFundingProvided(0.001 ether));
        assert(weatherTI.getInsurancePeriod(ALICE) == weatherTI.getTimePeriodBasedOnFundingProvided(0.002 ether));
        assert(keccak256(abi.encodePacked(weatherTI.getFarmerLocation(BOB))) == keccak256(abi.encodePacked("Jaipur")));
        assert(
            keccak256(abi.encodePacked(weatherTI.getFarmerLocation(ALICE))) == keccak256(abi.encodePacked("Udaipur"))
        );
    }

    function testStartInsuranceComparision() public {
        vm.prank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
        vm.prank(ALICE);
        weatherTI.getInsurance{value: 0.002 ether}("Udaipur");
        assert(weatherTI.getStartInsuranceTime()[0] == weatherTI.getStartInsuranceTime()[1]);
        assert(weatherTI.getStartInsuranceTime().length == 2);
        assert(weatherTI.getStartInsuranceTime()[0] == block.timestamp);
    }

    function testCheckUpkeepReturnsFalseWithNoInsurance() public {
        vm.prank(BOB);
        (bool upkeepNeed,) = weatherTI.checkUpkeep("");
        assert(upkeepNeed == false);
    }

    function testCheckUpkeepReturnsTrue() public {
        vm.prank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
        uint256 bobStartTime = block.timestamp;

        vm.warp(block.timestamp + 12 hours);
        vm.prank(ALICE);
        weatherTI.getInsurance{value: 0.002 ether}("Udaipur");
        uint256 aliceStartTime = block.timestamp;

        assert(bobStartTime + 12 hours == aliceStartTime);
        (bool upkeepNeeded, bytes memory performData) = weatherTI.checkUpkeep("");

        assertEq(weatherTI.getAddressToLastRainCheck(BOB), 0);

        assertEq(weatherTI.getAddressToLastRainCheck(ALICE), 0);

        assertEq(upkeepNeeded, true);
        // console.log("data1",keccak256(performData));
        console.log("ok");
        assert(keccak256(performData) == keccak256(abi.encode(ALICE)));
        assert(keccak256(abi.encodePacked(abi.decode(performData, (address)))) == keccak256(abi.encodePacked(ALICE)));
        assert(weatherTI.s_counter() == 1);
    }

    function testperformUpkeepIsWorkingFine() public {
        vm.startPrank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");

        (bool upkeepNeeded, bytes memory performData) = weatherTI.checkUpkeep("");
        weatherTI.performUpkeep(performData);
        vm.stopPrank();
        assert(upkeepNeeded == true);
        assert(weatherTI.getAddressToLastRainCheck(BOB) != 0);
    }

    function testIsDroughtWorkingProperly() public {
        vm.startPrank(BOB);
        weatherTI.getInsurance{value: 0.001 ether}("Jaipur");
        bool drought = weatherTI.isDrought(BOB, 400);
        assertEq(drought, false);
        assert(weatherTI.getAddressToTimesAPICalled(BOB) == 1);
        assert(weatherTI.getAddressToRainData(BOB)[0] == 400);
    }
}
