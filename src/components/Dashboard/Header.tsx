import WalletConnect from '@/components/App/WalletConnect';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME } from '@/app/utils/constants';
import { useSelector } from 'react-redux';

const Header = () => {
  const { address } = useChain(CHAIN_NAME);
  const owner = useSelector((state) => state.staking.owner);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const menu = document.getElementById('hamburger-menu');
    const clickListener = (event: MouseEvent) => {
      if (menu?.contains(event.target as Node)) {
        event.stopPropagation();
      } else {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', clickListener);
    return () => {
      document.removeEventListener('click', clickListener);
    };
  }, []);
  return (
    <>
      <div className='relative flex w-full h-[140px] px-12 lg:px-24 items-center justify-between text-white font-medium'>
        <div className='flex items-end text-[24px] space-x-4 leading-none'>
          <Link to='/' className='flex text-[34px] font-gotham-black'>
            StakEase
            <div className='text-[#AB71F4]'>.</div>
          </Link>
          <Link to='/home' className='font-[Inter] hidden lg:block'>
            Home
          </Link>
          <Link to='/profile' className='font-[Inter] hidden lg:block'>
            Profile
          </Link>
          <Link to='/stake' className='font-[Inter] hidden lg:block'>
            Stake
          </Link>
          {address && address == owner && (
            <Link to='/admin' className='font-[Inter] hidden lg:block'>
              Admin
            </Link>
          )}
        </div>
        <div className='hidden lg:block'>
          <WalletConnect />
        </div>
        <div
          id='hamburger-menu'
          className='relative block lg:hidden text-[40px] w-fit h-fit p-2 cursor-pointer z-10'
          onClick={() => setIsOpen(!isOpen)}
        >
          <GiHamburgerMenu />
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
    </>
  );
};

export default Header;
