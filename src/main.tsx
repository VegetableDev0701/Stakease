import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import WalletStoreWrapper from './store/WalletProvider.tsx';
import { Provider } from 'react-redux';
import { ChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import '@interchain-ui/react/styles';
import store from './app/store';
import { register } from 'swiper/element/bundle';
register();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChainProvider
      chains={chains}
      assetLists={assets}
      wallets={[...keplrWallets, ...leapWallets]}
      // wallets={[keplrWallets[0], leapWallets[0]]}
      walletConnectOptions={{
        signClient: {
          projectId: '0279c013b4fd637ac7b62e8c393dd28b',
          relayUrl: 'wss://relay.walletconnect.org',
          metadata: {
            name: 'Injective NFT Staking',
            description: 'Injective NFT Staking',
            url: 'https://injective-cw721-staking.vercel.app/',
            icons: [],
          },
        },
      }}
      // endpointOptions={{
      //   injective: {
      //     rpc: ['https://sentry.tm.injective.network:443'],
      //   },
      // }}
    >
      <WalletStoreWrapper>
        <Provider store={store}>
          <App />
        </Provider>
      </WalletStoreWrapper>
    </ChainProvider>
  </React.StrictMode>
);
