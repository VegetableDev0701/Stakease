import { createContext, useState } from 'react';
import { getAddresses, walletStrategy } from '../app/services/wallet';
import {
  BaseAccount,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  MsgExecuteContractCompat,
  TxRestApi,
  createSignDocFromTransaction,
  createTransactionWithSigners,
  createTxRawFromSigResponse,
  fromBase64,
  getGasPriceBasedOnMessage,
  getInjectiveAddress,
  toBase64,
} from '@injectivelabs/sdk-ts';
import { MsgBroadcaster, Wallet } from '@injectivelabs/wallet-ts';
import {
  useChain,
  useChainWallet,
  useWallet,
  useWalletClient,
} from '@cosmos-kit/react';
import { toast } from 'react-hot-toast';
import { NETWORK, chainGrpcWasmApi } from '@/app/services';
import { CHAIN_NAME } from '@/app/utils/constants';
import {
  Network,
  getNetworkEndpoints,
  getNetworkInfo,
} from '@injectivelabs/networks';
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  getStdFee,
} from '@injectivelabs/utils';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

type StoreState = {
  queryContract: () => Promise<void>;
  executeContract: () => Promise<void>;
};

export const WalletContext = createContext<StoreState>({
  queryContract: async () => {},
  executeContract: async () => {},
});

type Props = {
  children: React.ReactNode;
};

const WalletStoreWrapper = (props: Props) => {
  const [injectiveAddress, setInjectiveAddress] = useState('');
  const walletContext = useWallet();
  const { address, getCosmWasmClient } = useChain(CHAIN_NAME);

  const queryContract = async (contractAddress: string, queryMsg: any) => {
    try {
    // const cosmwasmClient = await getCosmWasmClient();
    // return await cosmwasmClient.queryContractSmart(contractAddress, queryMsg);
    const response = await chainGrpcWasmApi.fetchSmartContractState(
      contractAddress,
      toBase64(queryMsg)
    );
    const data = fromBase64(Buffer.from(response.data).toString('base64'));
    return data;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const executeContract = async (
    contractAddress: string,
    executeMsg: any,
    funds: any = undefined
  ) => {
    try {
      const networkInfo = getNetworkInfo(NETWORK);
      const endpoints = getNetworkEndpoints(NETWORK);
      const { chainId } = networkInfo;

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress,
        sender: address,
        msg: executeMsg,
        funds,
      });

      const msgs = Array.isArray(msg) ? msg : [msg];

      /** Account Details * */
      const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest);
      const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
        address
      );
      const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
      const accountDetails = baseAccount.toAccountDetails();

      /** Block Details */
      const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest);
      const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
      const latestHeight = latestBlock.header.height;
      const timeoutHeight = new BigNumberInBase(latestHeight).plus(
        DEFAULT_BLOCK_TIMEOUT_HEIGHT
      );

      const account = await walletContext.mainWallet?.client.getAccount(
        chainId
      );
      const pubKey = Buffer.from(account?.pubkey).toString('base64');
      const gas = getGasPriceBasedOnMessage(msgs).toString();

      /** Prepare the Transaction * */
      const { txRaw } = {
        ...createTransactionWithSigners({
          chainId,
          message: msgs,
          timeoutHeight: timeoutHeight.toNumber(),
          signers: {
            pubKey,
            accountNumber: accountDetails.accountNumber,
            sequence: accountDetails.sequence,
          },
        }),
        fee: getStdFee({ gas }),
      };
      const signDoc = createSignDocFromTransaction({
        txRaw,
        chainId,
        address,
        accountNumber: accountDetails.accountNumber,
      });

      const directSignResponse =
        await walletContext.mainWallet?.client.signDirect(
          chainId,
          address,
          signDoc
        );

      const txRawFromSigResponse =
        createTxRawFromSigResponse(directSignResponse);
      const txBytes = TxRaw.encode(txRawFromSigResponse).finish();
      const client = await getCosmWasmClient();
      const txHash = await client.broadcastTxSync(txBytes);
      const txResponse = await new TxRestApi(endpoints.rest).fetchTxPoll(
        txHash
      );
      if (txResponse.code == 0) toast.success('Execute success.');
      else toast.error('Something went wrong.');
    } catch (e) {
      console.error(e);
      let msg = 'Something went wrong.';
      if (e.originalMessage) msg = e.originalMessage.split(':')[0];
      else if (e.message) msg = e.message;
      toast.error(msg);
    }
    return null;
  };

  return (
    <WalletContext.Provider value={{ queryContract, executeContract }}>
      <div>{props.children}</div>
    </WalletContext.Provider>
  );
};

export default WalletStoreWrapper;
