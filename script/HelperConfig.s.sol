//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {WeatherTriggeredInsurance} from "src/WeatherTriggeredInsurance.sol";
import {MockFunctionsRouter} from "../test/mocks/MockFunctionRouter.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

abstract contract CodeConstants {
    /*VRF MOCK VALUES */
    // uint96 public constant MOCK_BASE_FEE = 0.25 ether;
    // uint96 public constant MOCK_GAS_PRICE_LINK = 1e9;
    // int256 public constant MOCK_WIE_PER_UNIT_LINK = 4e15;
    uint256 public constant ETH_SEPOLIA_CHAIN_ID = 11155111;
    uint256 public constant LOCAL_CHAIN_ID = 31337;
}

contract HelperConfig is Script, CodeConstants {
    error HelperConfig__InvaidChainID();

    struct NetworkConfig {
        address router;
        bytes32 donId;
        uint32 gasLimit;
        uint64 subscriptionId;
        string sourceString;
        string apiKey;
        address mostRecentDeployed;
    }

    NetworkConfig public activeNetworkConfig;
    mapping(uint256 chainId => NetworkConfig) public networkConfigs;

    constructor() {
        networkConfigs[ETH_SEPOLIA_CHAIN_ID] = getSepoliaEthConfig();
    }

    function getConfigByChainId(uint256 chainID) public returns (NetworkConfig memory) {
        if (networkConfigs[chainID].router != address(0)) {
            return networkConfigs[chainID];
        } else if (chainID == LOCAL_CHAIN_ID) {
            //getOrCreateAnvilEthConfig();
            return getOrCreateAnvilEthConfig();
        } else {
            revert HelperConfig__InvaidChainID();
        }
    }

    function getConfig() public returns (NetworkConfig memory) {
        return getConfigByChainId(block.chainid);
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            router: 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0,
            donId: 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000,
            gasLimit: 300000,
            subscriptionId: 5053,
            sourceString: string(
                abi.encodePacked(
                    "const city = args[0];",
                    "const apiKey = args[1];",
                    "const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;",
                    "const response = await Functions.makeHttpRequest({ url });"
                    "if (response.error) {throw Error('API call failed');}",
                    'const rainfall = response.data?.rain?.["1h"] ?? 0;',
                    "return Functions.encodeUint256(Math.round(rainfall * 100));"
                )
            ),
            apiKey: "9afe409adf567a9f89413f1c5d7875fc",
            mostRecentDeployed: DevOpsTools.get_most_recent_deployment("FarmerNFT", block.chainid)
        });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.router != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        MockFunctionsRouter mockRouter = new MockFunctionsRouter();
        vm.stopBroadcast();

        NetworkConfig memory localNetwork = NetworkConfig({
            router: address(mockRouter),
            donId: bytes32("dummy_don"),
            gasLimit: 500000,
            subscriptionId: 0,
            sourceString: "return Functions.encodeUint256(7);",
            apiKey: "123",
            mostRecentDeployed: DevOpsTools.get_most_recent_deployment("FarmerNFT", block.chainid)
        });
        // mostRecentDeployed: 0xe0B39353F69b54e945364ffcdDD7901697Ca0166

        return localNetwork;
    }
}
