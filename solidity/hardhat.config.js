require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://1rpc.io/sepolia",
      gas: "auto",
      accounts: [
        "68c915b63850056b042be66e1b3519251610bd5e4f85cf8f840c8f150a6c9eea",
        "306e354bf19c7d7c2f953ded1efba3953fdde4c4161cee58144322dc25f6aca8",
        "cb7808a1baf68e7dd38db78a039cd54a754a3cdea9a24569d99bef24491c9b72",
        "9b609a0d10cbc5f82673ff7e8d5a9316794536e18190cf89fd2585356f349fc2",
      ],
    },
  },
  defaultNetwork: "sepolia",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
};
