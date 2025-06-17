// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {FarmerNFT} from "../src/FarmerNFT.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract MintFarmerNft is Script {
    // string public constant PUG_URI =
    //     "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    // string public constant STBERNARD =
    //     "ipfs://bafybeifu3dm75qdlw2fkbet3k762a2hg4kgwwqusgw5pbcgs25ixtobgfu";

    string public constant DEFAULT_FARMER_JSON_URL = "ipfs://QmcQb1rrDzbtPxyBMyqbGeqaG4N7PCnmw5P81eR4Wj4uqG";

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("FarmerNFT", block.chainid);
        mintNftOnContract(mostRecentlyDeployed);
    }

    function mintNftOnContract(address contractAddress) public {
        vm.startBroadcast();
        // BasicNft(contractAddress).mintNft(PUG_URI);
        FarmerNFT(contractAddress).mintNft(DEFAULT_FARMER_JSON_URL);

        vm.stopBroadcast();
    }
}
