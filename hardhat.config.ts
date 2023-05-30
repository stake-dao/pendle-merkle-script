import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types';

const DUMMY_PRIVATE_KEY = '0x1111111111111111111111111111111111111111111111111111111111111111';

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    paths: {
        sources: './contracts',
        tests: './scripts',
        artifacts: './build/artifacts',
        cache: './build/cache',
    },
    networks: {
        hardhat: {
            chainId: 1,
            forking: {
                url: 'https://rpc.ankr.com/eth',
            },
            accounts: [
                {
                    privateKey: `${DUMMY_PRIVATE_KEY}`,
                    balance: '1000000000000000000000000000000000000',
                },
            ],
            loggingEnabled: false,
        },
        mainnet: {
            url: 'https://rpc.ankr.com/eth',
            chainId: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.17',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 90000, // 2^32-1
                    },
                },
            }
        ],
    },
};

export default config;
