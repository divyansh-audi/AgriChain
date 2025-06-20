// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockFunctionsRouter {
    event RequestSent(bytes32 requestId, string location);

    bytes32 private s_lastRequestId;
    mapping(bytes32 => string) public requestToLocation;

    function sendRequest(bytes memory, /* request */ uint64, /* subId */ uint32, /* gasLimit */ bytes32 /* donId */ )
        external
        returns (bytes32)
    {
        // Simulate a request being sent
        s_lastRequestId = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        requestToLocation[s_lastRequestId] = "Jaipur"; // mock static location
        emit RequestSent(s_lastRequestId, "Jaipur");
        return s_lastRequestId;
    }

    function getLastRequestId() public view returns (bytes32) {
        return s_lastRequestId;
    }
}
