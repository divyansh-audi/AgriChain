// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {WeatherTriggeredInsurance} from "src/WeatherTriggeredInsurance.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployWeatherTriggeredInsurance is Script {
    HelperConfig helperConfig;

    function run() external returns (WeatherTriggeredInsurance, HelperConfig) {
        helperConfig = new HelperConfig();

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        vm.startBroadcast();
        WeatherTriggeredInsurance weatherTrig = new WeatherTriggeredInsurance(
            config.router,
            config.donId,
            config.gasLimit,
            config.subscriptionId,
            config.sourceString,
            config.mostRecentDeployed
        );
        vm.stopBroadcast();
        return (weatherTrig, helperConfig);
    }
}
