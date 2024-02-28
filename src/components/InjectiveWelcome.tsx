import React from "react";
import WalletConnect from "./App/WalletConnect";
import InjectiveLogo from "./InjectiveLogo";

type Props = {};

const InjectiveWelcome = (props: Props) => {
  return (
    <div>
      <div className='header'>
        <WalletConnect />
      </div>
      <main>
        <div className='content'>
          <InjectiveLogo />
          <p>Create Injective App</p>
          <a
            target='_blank'
            href='https://docs.ts.injective.network'
          >
            Learn how to build on top of Injective
          </a>
        </div>
      </main>
    </div>
  );
};

export default InjectiveWelcome;
