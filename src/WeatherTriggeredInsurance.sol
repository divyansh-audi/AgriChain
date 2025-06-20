// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {IERC721} from "forge-std/interfaces/IERC721.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_3_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract WeatherTriggeredInsurance is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface {
    using FunctionsRequest for FunctionsRequest.Request;

    error WeatherTriggeredInsurance__FarmerNFTNotMinted();
    error WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance();
    error UnexpectedRequestID(bytes32 requestId);
    error WeatherTriggeredInsurance__TransferFailed();

    address payable[] private s_InsuranceUsers;
    uint256[] private s_startInsuranceTime;
    uint256 public s_counter;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    uint64 public s_subscriptionId;

    string public s_source;
    string public s_character;
    bytes32 private immutable i_donID;
    uint32 private immutable i_gasLimit;

    mapping(address => uint256) private s_adressToInsurancePeriod;
    mapping(address => string) private s_addressToFarmerLocation;
    mapping(address => uint256) private s_addressToLastRainCheck;
    mapping(bytes32 => address) private s_requestIdToUser;
    mapping(address => uint256[7]) private s_addressToRainData;
    mapping(address => uint256) private s_addressToTimeAPIIsCalled;

    constructor(address router, bytes32 donId, uint32 gasLimit, uint64 subscriptionId, string memory source)
        FunctionsClient(router)
        ConfirmedOwner(msg.sender)
    {
        s_subscriptionId = subscriptionId;
        s_counter = 0;
        i_donID = donId;
        i_gasLimit = gasLimit;
        s_source = source;
    }

    IERC721 public farmerNft;

    event InsuranceEnter(address indexed user);
    event TimePeriodAssigned();
    event InsuranceTimeStarted(uint256 indexed timeStarted);
    event Response(bytes32 indexed requestId, string character, bytes response, bytes err);
    event OneDayCheckUpdated(address indexed user);
    event LocationAssigned(address indexed user);

    function getInsurance(address to, string memory location) public payable {
        address mostRecentDeployment = DevOpsTools.get_most_recent_deployment("FarmerNFT", block.chainid);
        farmerNft = IERC721(mostRecentDeployment);
        if (farmerNft.balanceOf(to) <= 0) {
            revert WeatherTriggeredInsurance__FarmerNFTNotMinted();
        }
        if (msg.value < 0.001 ether) {
            revert WeatherTriggeredInsurance__NotEnoughFundsToGetInsurance();
        }
        s_startInsuranceTime.push(block.timestamp);
        emit InsuranceTimeStarted(block.timestamp);
        s_InsuranceUsers.push(payable(msg.sender));
        emit InsuranceEnter(msg.sender);
        s_adressToInsurancePeriod[msg.sender] = getTimePeriodBasedOnFundingProvided(msg.value);
        emit TimePeriodAssigned();
        s_addressToFarmerLocation[msg.sender] = location;
        emit LocationAssigned(msg.sender);
    }

    function getTimePeriodBasedOnFundingProvided(uint256 _amountFunded) public pure returns (uint256) {
        uint256 baseTime = 365 days;
        return (baseTime * 0.01 ether) / _amountFunded;
    }

    function checkUpkeep(bytes calldata /*checkData*/ )
        external
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        if (s_InsuranceUsers.length == 0) return (false, "");
        uint256 checkIndex = UpkeepChecker();
        uint256 currentTime = block.timestamp;
        uint256 timePassed = currentTime - s_startInsuranceTime[checkIndex];
        bool wholeDayPassed;
        bool validInsurance = timePassed < s_adressToInsurancePeriod[s_InsuranceUsers[checkIndex]];
        if (s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]] == 0) {
            wholeDayPassed = true;
        } else {
            wholeDayPassed = (currentTime - s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]]) > 1 days;
        }
        // s_addressToLastRainCheck[s_InsuranceUsers[checkIndex]] = currentTime;
        // emit OneDayCheckUpdated(s_InsuranceUsers[checkIndex]);
        upkeepNeeded = (validInsurance && wholeDayPassed);
        upkeepNeeded = (validInsurance && wholeDayPassed);

        if (upkeepNeeded) {
            performData = abi.encode(s_InsuranceUsers[checkIndex]);
        } else {
            performData = "";
        }
        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData) external override {
        address user = abi.decode(performData, (address));

        string[] memory args;
        args[0] = s_addressToFarmerLocation[user];
        args[1] = "9afe409adf567a9f89413f1c5d7875fc";

        bytes32 requestId = sendRequest(s_subscriptionId, args);
        s_requestIdToUser[requestId] = user;
        s_addressToLastRainCheck[user] = block.timestamp;
        emit OneDayCheckUpdated(user);
    }

    function UpkeepChecker() public returns (uint256) {
        if (s_counter == s_InsuranceUsers.length) {
            s_counter = 0;
        } else {
            s_counter++;
        }
        return s_counter;
    }

    function _fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }

        address user = s_requestIdToUser[requestId];
        // Update the contract's state variables with the response and any errors
        uint256 rainfall = abi.decode(response, (uint256));
        bool drought = isDrought(user, rainfall);
        if (drought) {
            uint256 amount = (address(this).balance) / (s_InsuranceUsers.length / 4);
            (bool success,) = user.call{value: amount}("");
            if (!success) {
                revert WeatherTriggeredInsurance__TransferFailed();
            }
        }
        //rainfall logic to trigger
        s_lastResponse = response;
        s_character = string(response);
        s_lastError = err;

        // Emit an event to log the response
        emit Response(requestId, s_character, s_lastResponse, s_lastError);
    }

    function sendRequest(uint64 subscriptionId, string[] memory args) public onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(s_source); // Initialize the request with JS code
        if (args.length > 0) req.setArgs(args); // Set the arguments for the request

        // Send the request and store the request ID
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, i_gasLimit, i_donID);

        return s_lastRequestId;
    }

    function isDrought(address user, uint256 rainfall) public returns (bool) {
        s_addressToRainData[user][s_addressToTimeAPIIsCalled[user] % 7] = rainfall;
        s_addressToTimeAPIIsCalled[user]++;
        if (s_addressToTimeAPIIsCalled[user] < 7) return false;
        for (uint256 i = 0; i < 7; i++) {
            if (s_addressToRainData[user][i] > 500) {
                return false;
            }
        }
        return true;
    }
}
