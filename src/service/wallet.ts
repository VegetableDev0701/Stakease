import { WalletStrategy } from "@injectivelabs/wallet-ts";
import { Web3Exception } from "@injectivelabs/exceptions";

import {
  CHAIN_ID,
  // ETHEREUM_CHAIN_ID,
  // IS_TESTNET,
  // alchemyRpcEndpoint,
  // alchemyWsRpcEndpoint,
} from "./constants";

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  // ethereumOptions: {
  //   ethereumChainId: ETHEREUM_CHAIN_ID,
  //   // wsRpcUrl: alchemyWsRpcEndpoint,
  //   rpcUrl: alchemyRpcEndpoint,
  // },
});

export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses();
  if (addresses.length === 0) {
    throw new Web3Exception(
      new Error("There are no addresses linked in this wallet.")
    );
  }
  return addresses;
};

export const getPublicKey = async (): Promise<string> => {
  const publickey = await walletStrategy.getPubKey()
  return publickey
}