// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {FarmerNFT} from "src/FarmerNFT.sol";

contract DeployFarmerNFT is Script {
    FarmerNFT farmerNFT;

    function run() external returns (FarmerNFT) {
        vm.startBroadcast();
        farmerNFT = new FarmerNFT();
        vm.stopBroadcast();
        return farmerNFT;
    }
}
