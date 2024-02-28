import { Network } from "@injectivelabs/networks";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";

export const IS_PRODUCTION: boolean = import.meta.env.PROD;
export const IS_DEVELOPMENT = !IS_PRODUCTION;

const env = {
  VITE_ALCHEMY_KEY: import.meta.env.VITE_ALCHEMY_KEY as string,
  VITE_NETWORK: import.meta.env.VITE_NETWORK as string,
  VITE_ETHEREUM_CHAIN_ID: import.meta.env.VITE_ETHEREUM_CHAIN_ID as string,
  VITE_CHAIN_ID: import.meta.env.VITE_CHAIN_ID as string,
};

export const ALCHEMY_KEY = env.VITE_ALCHEMY_KEY;

export const alchemyRpcEndpoint = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`;
export const alchemyWsRpcEndpoint = `wss://eth-goerli.ws.alchemyapi.io/v2/${ALCHEMY_KEY}`;

export const ETHEREUM_CHAIN_ID = (env.VITE_ETHEREUM_CHAIN_ID ||
  EthereumChainId.Goerli) as EthereumChainId;
export const CHAIN_ID = (env.VITE_CHAIN_ID || ChainId.Testnet) as ChainId;

export const NETWORK: Network =
  (env.VITE_NETWORK as Network) || Network.Testnet;

export const IS_TESTNET: boolean = [
  Network.Testnet,
  Network.TestnetK8s,
].includes(NETWORK);

export const STAKING_CONTRACT: string = "inj1gaw0mm09myhf8murs0hazft38twd3pxntng9y7";

export const CHAIN_NAME = IS_TESTNET ? 'injectivetestnet' : 'injective';

export const X_LINK = "https://x.com/swordsaga_?s=21&t=GF8jhvKVjx-kUaoVLfaSNw";
export const DISCORD_LINK = "https://discord.gg/FYVyknSKpX";