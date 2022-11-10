require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;
const ALCHEMY_MAINNET_RPC_URL = process.env.ALCHEMY_MAINNET_RPC_URL;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
//   solidity: "0.8.10",
//   networks: {
//     hardhat: {
//       forking: {
//         url: QUICKNODE_RPC_URL,
//       },
//     },
//   },
// };

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_MAINNET_RPC_URL,
      },
    },
  },
};