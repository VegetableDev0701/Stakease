import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import arr from '@/assets/images/arr.svg';
import { useWalletStore } from '@/hooks';
import WalletConnect from '../App/WalletConnect';
import { useSelector } from 'react-redux';
import { CHAIN_NAME, DISCORD_LINK, X_LINK } from '@/app/utils/constants';
import { useChain } from '@cosmos-kit/react';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function clickHandler(event: MouseEvent) {
      // @ts-ignore
      if (wrapperRef.current && !wrapperRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);
  const name = useSelector((state) => state.config.name);
  const avatar = useSelector((state) => state.config.avatar);
  const { pathname } = useLocation();
  const { address } = useChain(CHAIN_NAME);
  return (
    <div className='flex justify-between items-center h-[110px] text-white font-medium'>
      <div className='capitalize text-[32px] font-gotham-black'>
        {pathname.slice(1)}
      </div>
      <div className='flex items-center space-x-4 sm:space-x-8 text-[28px]'>
        <Link to={X_LINK} target='_blank'>
          <FaTwitter />
        </Link>
        <Link to={DISCORD_LINK} target='_blank'>
          <FaDiscord />
        </Link>
        {address ? (
          <div
            ref={wrapperRef}
            id='hamburger-menu-topbar'
            className='relative text-[40px] w-fit h-fit p-2 cursor-pointer z-10'
            onClick={(event) => {
              setIsOpen(!isOpen);
              event.stopPropagation();
            }}
          >
            <div className='relative flex items-center space-x-[10px]'>
              <img
                className='w-[50px] h-[50px] rounded-full'
                src={avatar}
                alt='avatar'
              />
              <div className='text-[14px] hidden sm:block'>{name}</div>
              <img src={arr} alt='arr' className='hidden sm:block' />
              {isOpen && (
                <div className='absolute top-full right-0 bg-gray-800 border border-gray-600 rounded-lg p-4 flex flex-col text-[16px] gap-3 z-20'>
                  <Link
                    to='/home'
                    className='font-[Inter] px-3 py-2 hover:text-blue-400'
                  >
                    Home
                  </Link>
                  <Link
                    to='/profile'
                    className='font-[Inter] px-3 py-2 hover:text-blue-400'
                  >
                    Profile
                  </Link>
                  <Link
                    to='/stake'
                    className='font-[Inter] px-3 py-2 hover:text-blue-400'
                  >
                    Stake
                  </Link>
                  <WalletConnect />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='text-[16px]'>
            <WalletConnect />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
