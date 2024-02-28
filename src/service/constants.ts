import { Network } from "@injectivelabs/networks";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";

export const isProduction = process.env.NODE_ENV === "production";

export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === "development";
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === "production";

const env = {
  NEXT_ALCHEMY_GOERLI_KEY: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_KEY,
  NEXT_NETWORK: process.env.NEXT_NETWORK,
  NEXT_ETHEREUM_CHAIN_ID: process.env.NEXT_ETHEREUM_CHAIN_ID,
  NEXT_CHAIN_ID: process.env.NEXT_CHAIN_ID,
};

export const ALCHEMY_GOERLI_KEY = env.NEXT_ALCHEMY_GOERLI_KEY;

export const alchemyRpcEndpoint = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_GOERLI_KEY}`;
// export const alchemyWsRpcEndpoint = `wss://eth-goerli.ws.alchemyapi.io/v2/${ALCHEMY_GOERLI_KEY}`;

export const ETHEREUM_CHAIN_ID = (env.NEXT_ETHEREUM_CHAIN_ID ||
  EthereumChainId.Goerli) as EthereumChainId;
export const CHAIN_ID = (env.NEXT_CHAIN_ID || ChainId.Mainnet) as ChainId;

export const NETWORK: Network =
  (env.NEXT_NETWORK as Network) || Network.Mainnet;

export const IS_TESTNET: Boolean = [
  Network.Testnet,
  Network.TestnetK8s,
].includes(NETWORK);

export const CHAIN_NAME = IS_TESTNET ? 'injectivetestnet' : 'injective';

export declare const DEFAULT_BLOCK_TIMEOUT_HEIGHT = 90;
export const OWNER_CONTRACT_ADDRESS =
  "inj1t35ykue5azt725d4aesd3z7en44j0jck8ap766";