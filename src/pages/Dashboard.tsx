import Header from '@/components/Dashboard/Header';
import writing from '@/assets/images/writing.svg';
import injLogo from '@/assets/images/inj-logo.svg';
import homeShot from '@/assets/images/home-shot.png';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <div className='relative'>
        <div className='relative flex flex-col items-center w-full z-[2]'>
          <Header />
          <div className='w-[calc(100vw_-_28px)] h-[1px] bg-[#D9D9D9]' />
        </div>
        <img
          src={homeShot}
          alt='home screenshot'
          className='hidden xl:block absolute left-[900px] top-[400px] w-auto h-[740px] opacity-20 drop-shadow-[0px_0px_8px_rgba(160,110,240,0.2)] rounded-[30px]'
        />
        <img
          src={homeShot}
          alt='home screenshot'
          className='hidden xl:block absolute left-[1000px] top-[260px] w-auto h-[740px] drop-shadow-[0px_0px_10px_rgba(160,110,240,0.4)] rounded-[30px]'
        />
        <div className='relative flex flex-col items-center lg:items-start px-12 lg:px-24 pt-[60px] lg:pt-[104px] z-[1] w-auto max-w-[1000px] font-medium'>
          <div className='flex self-center lg:self-auto items-center w-fit bg-[rgba(52,254,254,0.32)] rounded-full px-3 py-2'>
            <div className='hidden sm:block bg-[#34FEFE] rounded-full px-5 py-1 text-[#111319] font-gotham-black'>
              NEW
            </div>
            <div className='text-[#34FEFE] mx-3 text-center'>
              StakEase is here with a new CTA, Start cashing in now!
            </div>
          </div>
          <div className='text-[30px] sm:text-[36px] md:text-[42px] mt-8 font-gotham-black'>
            <div>
              Unlock the Power of Your NFTs with Our Staking Hub - Elevate Your
              Assets,
            </div>
            <div className='text-[#6978DB]'>Maximize Rewards!</div>
          </div>
          <img className='my-16' width={400} src={writing} alt='writing' />
          <div className='w-auto max-w-[770px] font-semibold text-[20px] text-[#FFFFFFCD]'>
            Ready to take your NFTs to the next level? Join our Staking Hub and
            supercharge your digital assets! Earn passive rewards while
            maintaining full control over your NFT portfolio. Don't miss out on
            the opportunity to maximize the potential of your investments. Seize
            the future of NFT staking now -&nbsp;
            <span className='text-[#6978DB] cursor-pointer'>sign up</span>
            &nbsp;and start earning with confidence!
          </div>
          <Link
            to='/home'
            className='mt-14 w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-12 py-3 text-[24px] font-bold'
          >
            Let's Stake
          </Link>
          <div className='flex flex-col lg:flex-row my-16 gap-10'>
            <div className='flex flex-col items-center font-medium w-[260px] px-4 py-5 bg-gradient-to-br from-[#14161C] to-[#34FEFE52] rounded-[6px] border border-[#FFFFFF1A]'>
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-white rounded-full'>
                  <img className='w-8 h-8' src={injLogo} alt='inj logo' />
                </div>
                <div className='ml-5 font-gotham-black'>392.5 + INJ EARNED</div>
              </div>
              <div className='mt-3 flex items-center text-[12px] pl-3 py-2 border-l border-[#34FEFE]'>
                Our customers reap INJ rewards, staking for financial growth.
              </div>
            </div>
            <div className='flex flex-col items-center font-medium w-[260px] px-4 py-5 bg-gradient-to-br from-[#14161C] to-[#AB71F452] rounded-[6px] border border-[#FFFFFF1A]'>
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-white rounded-full'>
                  <img className='w-8 h-8' src={injLogo} alt='inj logo' />
                </div>
                <div className='ml-5 font-gotham-black'>392.5 + INJ EARNED</div>
              </div>
              <div className='mt-3 flex items-center text-[12px] pl-3 py-2 border-l border-[#34FEFE]'>
                Our customers reap INJ rewards, staking for financial growth.
              </div>
            </div>
            <div className='flex flex-col items-center font-medium w-[260px] px-4 py-5 bg-gradient-to-br from-[#14161C] to-[#6978DB52] rounded-[6px] border border-[#FFFFFF1A]'>
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-white rounded-full'>
                  <img className='w-8 h-8' src={injLogo} alt='inj logo' />
                </div>
                <div className='ml-5 font-gotham-black'>392.5 + INJ EARNED</div>
              </div>
              <div className='mt-3 flex items-center text-[12px] pl-3 py-2 border-l border-[#34FEFE]'>
                Our customers reap INJ rewards, staking for financial growth.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute max-w-[100vw] w-[1000px] h-[1000px] bg-radial-gradient -left-[300px] -top-[500px] rounded-full opacity-20 blur-3xl -z-10'></div>
      <div className='fixed w-[1000px] h-[1000px] bg-radial-gradient -right-[300px] -bottom-[500px] rounded-full opacity-20 blur-3xl -z-10'></div>
    </>
  );
};

export default Dashboard;
