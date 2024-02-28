import React from 'react';
import Button from './Button';
import { useWalletStore } from '../../hooks';
import { useChain, useManager } from '@cosmos-kit/react';
import { CHAIN_NAME } from '@/app/utils/constants';
import {toast} from 'react-hot-toast';

const WalletConnect = () => {
  const chainContext = useChain(CHAIN_NAME);
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    isWalletConnected,
    chain: chainInfo,
  } = chainContext;
  const { getChainLogo } = useManager();

  const formattedAddress = `${address?.slice(0, 5)}...${address?.slice(-5)}`;

  async function handleConnectWallet() {
    try {
      await connect();
    } catch (e) {
      toast.error('Connect Wallet failed.');
    }
  }
  return (
    <button
      onClick={handleConnectWallet}
      className='bg-none border btn-hover border-[white] rounded py-2 w-[144px]'
    >
      {isWalletConnected ? formattedAddress : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnect;
