import { FaTwitter, FaDiscord, FaSearch } from 'react-icons/fa';
import swordSagaWarrior1 from '@/assets/images/sword-aga-warrior-1.png';
import Badge from '@/components/common/Badge';
import arr from '@/assets/images/arr.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { timespan } from '@/app/services';
import { DISCORD_LINK, STAKING_CONTRACT, X_LINK } from '@/app/utils/constants';
import { fromBase64, toBase64 } from '@injectivelabs/sdk-ts';
import { setCollectionIndex } from '@/app/stores/stakingSlice';
import Skeleton from 'react-loading-skeleton';
import millify from 'millify';
import { formatEther } from 'viem';
import { Swiper, SwiperSlide } from 'swiper/react';
import injectiveSwords from '@/assets/images/injective-swords.png';
import swordSaga from '@/assets/images/swordsaga.png';
import discordels from '@/assets/images/discordels.png';
import NFTMedia from '@/components/common/NFTMedia';

const Home = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const collectionsState = useSelector(
    (state: any) => state.staking.collections
  ) as Array<any>;
  const collections = collectionsState.filter(
    (c) => (c?.name ?? '' + c?.symbol ?? '').indexOf(searchFilter) >= 0
  );

  return (
    <div className='flex flex-col w-full'>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className='w-full'
      >
        <SwiperSlide className='w-full'>
          <div className='w-full flex flex-col-reverse lg:flex-row justify-between items-center bg-[#0E1213D7] rounded-xl p-[24px] md:p-[40px] lg:p-[52px] font-medium text-white gap-10'>
            <div className='w-full flex flex-col h-full justify-between gap-4'>
              <div className='text-[33px] text-[#FFFFFFE1] font-gotham-black'>
                <div>Featured Staking</div>
                <div className='text-white'>Collection INJECTIVE SWORDS</div>
              </div>
              <div className='text-[24px] font-normal'>
                Our staking application boasts a seamless user experience with
                cutting-edge features, and we're thrilled to introduce the
                latest addition of NFT functionality, enhancing the versatility
                and excitement of our platform.
              </div>
              <div className='flex items-center text-[20px] space-x-7 self-center md:self-auto'>
                <Link
                  className='w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black'
                  to='/profile'
                >
                  STAKE
                </Link>
                <div className='space-x-8 flex text-[36px] items-center'>
                  <Link to={X_LINK} target='_blank'>
                    <FaTwitter />
                  </Link>
                  <Link to={DISCORD_LINK} target='_blank'>
                    <FaDiscord />
                  </Link>
                </div>
              </div>
            </div>
            <img
              src={injectiveSwords}
              alt='nft profile image'
              className='w-[288px] h-[288px] rounded-md opacity-90 border border-[#FFF5] aspect-square'
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className='w-full'>
          <div className='w-full flex flex-col-reverse lg:flex-row justify-between items-center bg-[#0E1213D7] rounded-xl p-[24px] md:p-[40px] lg:p-[52px] font-medium text-white gap-10'>
            <div className='w-full flex flex-col h-full justify-between gap-4'>
              <div className='text-[33px] text-[#FFFFFFE1] font-gotham-black'>
                <div>Featured Staking</div>
                <div className='text-white'>
                  Collection SwordSaga: Warrior Edition
                </div>
              </div>
              <div className='text-[24px] font-normal'>
                Our staking application boasts a seamless user experience with
                cutting-edge features, and we're thrilled to introduce the
                latest addition of NFT functionality, enhancing the versatility
                and excitement of our platform.
              </div>
              <div className='flex items-center text-[20px] space-x-7 self-center md:self-auto'>
                <Link
                  className='w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black'
                  to='/profile'
                >
                  STAKE
                </Link>
                <div className='space-x-8 flex text-[36px] items-center'>
                  <Link to={X_LINK} target='_blank'>
                    <FaTwitter />
                  </Link>
                  <Link to={DISCORD_LINK} target='_blank'>
                    <FaDiscord />
                  </Link>
                </div>
              </div>
            </div>
            <img
              src={swordSaga}
              alt='nft profile image'
              className='w-[288px] h-[288px] rounded-md opacity-90 border border-[#FFF5] aspect-square object-cover'
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className='w-full flex flex-col lg:flex-row justify-between mt-7 gap-10'>
        <div className='flex text-white items-center'>
          <div className='text-[32px] font-[900] whitespace-nowrap'>
            All Collections
          </div>
          <Badge>{collections.length}</Badge>
        </div>
        <div className='flex gap-10 self-center flex-col md:flex-row'>
          <div className='flex items-center border border-[#FFFFFF1A] rounded'>
            <button className='flex items-center w-fit bg-gradient-to-b to-[#AB71F4] from-[#6978DB] rounded-s p-3 text-[18px] font-medium leading-none'>
              <FaSearch />
            </button>
            <input
              type='text'
              className='px-4 py-2 rounded-e border-none bg-transparent flex-1 outline-none placeholder:text-[#FFFA] min-w-[100px] lg:min-w-[200px]'
              placeholder='Search By Name'
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
          <button className='w-full flex items-center justify-center md:w-fit border border-[#FFFFFF1A] bg-gradient-to-b from-[#AB71F4] to-[#6978DB] rounded px-7 py-3 text-[18px] font-medium leading-none'>
            Owned <img src={arr} alt='arr' className='ml-[5px]' />
          </button>
        </div>
      </div>
      <div className='flex flex-wrap mt-[92px] justify-between gap-3 mb-10'>
        {collections.map((collection) => (
          <div className='bg-[#101219] rounded-md p-[10px] flex flex-col w-full sm:w-[calc(50%_-_20px)] lg:w-[calc(33%_-_20px)] 2xl:w-[calc(25%_-_20px)]'>
            {collection?.pfp ? (
              <NFTMedia metadata={collection?.pfp} />
            ) : (
              <Skeleton className='w-auto h-auto aspect-square' />
            )}

            <div className='flex justify-between'>
              <div className='flex flex-col leading-none mt-4'>
                <div className='text-[#FFFA] text-[18px] font-light'>
                  Collection Name
                </div>
                <div className='mt-1 font-gotham-black'>
                  {collection?.name ? (
                    collection?.name + ' (' + collection?.symbol + ')'
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </div>
              <div className='flex flex-col leading-none ml-4 mt-4 text-right'>
                <div className='text-[#FFFA] text-[18px] font-light'>
                  Collection Size
                </div>
                <div className='mt-1 font-gotham-black'>
                  {collection?.num_tokens ? (
                    millify(Number(collection?.num_tokens))
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-col leading-none mt-4'>
                <div className='text-[#FFFA] text-[18px] font-light'>
                  Total Staked
                </div>
                <div className='mt-1 font-gotham-black'>
                  {collection?.num_tokens ? (
                    collection?.staked +
                    '/' +
                    millify(Number(collection?.num_tokens))
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </div>
              <div className='flex flex-col leading-none ml-4 mt-4 text-right'>
                <div className='text-[#FFFA] text-[18px] font-light'>
                  Stake Rate
                </div>
                <div className='mt-1 font-gotham-black'>
                  {collection.reward ? (
                    formatEther(BigInt(collection?.reward?.amount)) +
                    ' $INJ / ' +
                    timespan.parse(collection?.cycle)
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-col leading-none mt-4'>
                <div className='text-[#FFFA] text-[18px] font-light'>
                  Spot Left
                </div>
                <div className='mt-1 font-gotham-black'>
                  {collection.spots ? (
                    Number(collection.spots) - Number(collection.staked)
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </div>
              <button
                className='w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none mt-3 font-gotham-black'
                onClick={() => {
                  dispatch(setCollectionIndex(collection.index));
                  navigate('/stake');
                }}
              >
                VIEW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
