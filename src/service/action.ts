import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  createTransaction,
  TxGrpcClient,
  BroadcastModeKeplr,
  getTxRawFromTxRawOrDirectSignResponse,
  MsgExecuteContractCompat,
} from "@injectivelabs/sdk-ts";
import {
  BigNumberInBase,
  DEFAULT_STD_FEE,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints, getNetworkInfo } from "@injectivelabs/networks";
import { CHAIN_ID, NETWORK } from '@/service/constants'
import { getAddresses } from "@/service/wallet";
const getKeplr = async (chainId: ChainId) => {
  await window.keplr.enable(chainId);
  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);
  return { offlineSigner, accounts, key };
};

const broadcastTx = async (chainId: ChainId, txRaw) => {
  const keplr = await getKeplr(ChainId.Mainnet);
  const result = await keplr.offlineSigner.keplr.sendTx(
    chainId,
    txRaw,
    BroadcastModeKeplr.Sync
  );

  if (!result || result.length === 0) {
    throw new TransactionException(
      new Error("Transaction failed to be broadcasted"),
      { contextModule: "Keplr" }
    );
  }

  return Buffer.from(result).toString("hex");
};

export const ActionHelper = async (
  contractAddress: string,
  executeMsg: any,
  funds: any = undefined) => {
  const sender = (await getAddresses())[0]
  debugger;
  try {
    const network = getNetworkInfo(Network.MainnetSentry);
    const chainId = ChainId.Mainnet; /* ChainId.Mainnet */
    const { key } = await getKeplr(chainId);
    const pubKey = Buffer.from(key.pubKey).toString("base64");
    const injectiveAddress = key.bech32Address;
    const restEndpoint = getNetworkEndpoints(Network.MainnetSentry).rest
    // const restEndpoint = 'https://sentry.tm.injective.network:443'
    const msg = MsgExecuteContractCompat.fromJSON({
      contractAddress,
      sender: sender,
      msg: executeMsg,
      funds
    });

    const msgs = Array.isArray(msg) ? msg : [msg];
    /** Account Details **/
    const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
      sender
    );
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
    const accountDetails = baseAccount.toAccountDetails();

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    console.log(latestHeight)
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT * 100
    );
    console.log(timeoutHeight.toNumber())

    /** Prepare the Transaction **/
    let { txRaw, signDoc } = createTransaction({
      pubKey,
      chainId,
      fee: DEFAULT_STD_FEE,
      message: msgs,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
    });
    const { offlineSigner } = await getKeplr(chainId)
    const directSignResponse = await offlineSigner.signDirect(
      injectiveAddress,
      signDoc
    );
    txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);

    const txService = new TxGrpcClient(network.grpc);
    const simulationResponse = await txService.simulate(txRaw);
    console.log(
      `Transaction simulation response: ${JSON.stringify(
        simulationResponse.gasInfo
      )}`
    );

    /** Broadcast transaction */
    const response = await txService.broadcast(txRaw);
    
    if (response.code == 0) {
      console.log('Execute success.');
      return true
    }
    else {
      console.error('Something went wrong.');
      return false
    }
  } catch (e) {
    console.error(e);
    return false
  }
}