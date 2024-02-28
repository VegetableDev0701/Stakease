import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { getAddresses, walletStrategy } from "./services/wallet";
import toast from "react-hot-toast";
import Timespan from 'readable-timespan';
import { ChainGrpcWasmApi, fromBase64, toBase64 } from "@injectivelabs/sdk-ts";

// export const NETWORK = Network.TestnetSentry;
export const NETWORK = Network.Mainnet;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);

export const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);

export const timespan = new Timespan({
  lessThanFirst: 'NOW',
  millisecond: 'MS',
  second: 'S',
  minute: 'MIN',
  hour: 'HR',
  day: 'DAY',
  week: 'WK',
  month: 'MO',
  year: 'YR',
  space: false,
  pluralize: false,
});