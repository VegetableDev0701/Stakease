import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { FaCoins, FaRegUser, FaTwitter, FaDiscord } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import arr from '@/assets/images/arr.svg';
import { DISCORD_LINK, X_LINK } from '@/app/utils/constants';

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <div className='fixed 2xl:relative min-w-[240px] flex flex-col justify-between items-center text-white font-medium min-h-screen bg-[#101219] z-10 left-[-240px] 2xl:left-0 2xl:border-0 hover:left-0 transition-all border-r border-r-gray-600'>
      <div className='absolute 2xl:hidden w-10 h-20 rounded-r-3xl border border-l-0 border-gray-600 bg-[#101219] z-20 left-full top-1/2 flex items-center justify-center -translate-y-1/2'>
        <img src={arr} alt='arr' className='-rotate-90' />
      </div>
      <div className='w-full flex flex-col items-center'>
        <Link to='/' className='flex text-[38px] my-8 font-gotham-black'>
          StakEase
          <div className='text-[#AB71F4]'>.</div>
        </Link>
        <Link
          to='/home'
          className={clsx('flex items-end w-full mt-5 sidebar-link', {
            'sidebar-link-active': pathname == '/home',
          })}
        >
          <div className='text-[20px] ml-12'>
            <FiHome />
          </div>
          <div className='text-[14px] ml-3 leading-none'>Home</div>
        </Link>
        <Link
          to='/profile'
          className={clsx('flex items-end w-full mt-7 sidebar-link', {
            'sidebar-link-active': pathname == '/profile',
          })}
        >
          <div className='text-[20px] ml-12'>
            <FaRegUser />
          </div>
          <div className='text-[14px] ml-3 leading-none'>Profile</div>
        </Link>
        <Link
          to='/stake'
          className={clsx('flex items-end w-full mt-7 sidebar-link', {
            'sidebar-link-active': pathname == '/stake',
          })}
        >
          <div className='text-[20px] ml-12'>
            <FaCoins />
          </div>
          <div className='text-[14px] ml-3 leading-none'>Staking</div>
        </Link>
      </div>
      <div className='w-full flex flex-col items-center border-t border-[#D9D9D955]'>
        <Link
          to={DISCORD_LINK}
          className='mt-9 w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black'
        >
          Support
        </Link>
        <div className='font-medium text-[#FFFFFFAA] mt-10'>v1.0.1</div>
        <div className='font-medium text-[#FFFFFF55] mt-5 w-40 text-center'>
          StakEase, 2024
          <br />
          All rights reserved.
        </div>
        <div className='mt-9 mb-8 space-x-8 flex'>
          <Link to={X_LINK} target='_blank'>
            <FaTwitter />
          </Link>
          <Link to={DISCORD_LINK} target='_blank'>
            <FaDiscord />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
