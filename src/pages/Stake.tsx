import swordSagaWarrior1 from '@/assets/images/sword-aga-warrior-1.png';
import Badge from '@/components/common/Badge';
import { useWalletStore } from '@/hooks';
import { useSelector } from 'react-redux';
import { formatEther } from 'viem';
import Skeleton from 'react-loading-skeleton';
import { timespan } from '@/app/services';
import { CHAIN_NAME, STAKING_CONTRACT } from '@/app/utils/constants';
import { useEffect, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import {
  PrivateKey,
  InjectiveStargate,
  toUtf8,
  MsgExecuteContractCompat,
} from '@injectivelabs/sdk-ts';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { assertIsBroadcastTxSuccess } from '@cosmjs/stargate';
import discordels from '@/assets/images/discordels.png';
import NFTMedia from '@/components/common/NFTMedia';
import Token from '@/components/common/Token';

const Stake = () => {
  const { executeContract } = useWalletStore();
  const [, rerender] = useState(false);
  useEffect(() => {
    const timerId = setInterval(() => {
      rerender((r) => !r);
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);
  const { address, getSigningCosmWasmClient } = useChain(CHAIN_NAME);
  const collectionIndex = useSelector((state) => state.staking.collectionIndex);
  const collections = useSelector((state) => state.staking.collections);
  const stakingsState = useSelector((state) => state.staking.stakings);
  const allTokens = useSelector((state) => state.staking.unstakedTokens);
  const stakings = allTokens?.length
    ? stakingsState.filter(
        (s) =>
          s.token_address == collections?.[collectionIndex].address &&
          !s.is_paid
      )
    : new Array(12).fill(0);
  const totalEarned = stakings.reduce(
    (s, t) =>
      s + stakings.start_timestamp
        ? Math.min(
            1,
            ((t.end_timestamp ? t.end_timestamp : Date.now()) -
              t.start_timestamp) /
              collections[collectionIndex].cycle
          ) * collections[collectionIndex].reward.amount
        : 0,
    0
  );
  const daysLocked = parseInt(
    stakings.reduce(
      (s, t) =>
        s + t.start_timestamp
          ? (t.end_timestamp ? t.end_timestamp : Date.now()) - t.start_timestamp
          : 0,
      0
    ) /
      24 /
      60 /
      60 /
      1000
  );
  return (
    <>
      {address ? (
        <div className='w-full flex flex-col mb-10'>
          <div className='w-full flex flex-col-reverse xl:flex-row justify-between items-center bg-[#0E1213D7] rounded-xl p-10 2xl:p-[52px] font-medium text-white gap-10'>
            <div className='w-full flex flex-col h-full justify-between'>
              <div className='w-full text-[33px] text-[#FFFFFFE1] font-gotham-black'>
                <div>Currently Staking</div>
                <div className='text-white'>
                  Collection&nbsp;
                  {(collections &&
                    collections?.length &&
                    collections[collectionIndex]?.name) || (
                    <Skeleton width={200} />
                  )}
                </div>
              </div>
              <div className='text-[24px] font-normal'>
                Our staking application boasts a seamless user experience with
                cutting-edge features, and we're thrilled to introduce the
                latest addition of NFT functionality, enhancing the versatility
                and excitement of our platform.
              </div>
              <div className='flex flex-col md:flex-row items-center text-[20px] gap-6 mt-6 xl:m-0'>
                <div className='flex items-center font-gotham-black'>
                  Currently Staked:<Badge>{stakings.length}</Badge>
                </div>
                <div className='flex items-center font-gotham-black'>
                  $INJ Accumulated:
                  <Badge>
                    {parseFloat(formatEther(totalEarned)).toFixed(1)}
                  </Badge>
                </div>
                <div className='flex items-center font-gotham-black'>
                  Days Locked<Badge>{daysLocked}</Badge>
                </div>
              </div>
            </div>
            {collections[collectionIndex]?.pfp ? (
              <div className='max-w-[288px] max-h-[288px]'>
                <NFTMedia metadata={collections[collectionIndex]?.pfp} />
              </div>
            ) : (
              <Skeleton className='w-[288px] h-[288px] aspect-square' />
            )}
          </div>
          <div className='flex flex-wrap justify-between mt-[92px] gap-8'>
            {stakings.map((staking, index) => (
              <div className='bg-[#101219] rounded-md p-[10px] flex flex-col w-full sm:w-[calc(50%_-_20px)] lg:w-[calc(33%_-_20px)] 2xl:w-[calc(25%_-_30px)]'>
                <Token
                  collectionIndex={collectionIndex}
                  collection={staking.token_address}
                  tokenId={staking.token_id}
                  skeletonStyle='w-auto h-auto aspect-square'
                />
                <div className='text-white text-[18px] text-ellipsis whitespace-nowrap mt-4 font-gotham-black'>
                  {staking?.start_timestamp ? (
                    collections?.[collectionIndex]?.name +
                    (isNaN(Number(staking.token_id))
                      ? staking.token_id
                      : ' #' + (Number(staking.token_id) + 1).toString())
                  ) : (
                    <Skeleton />
                  )}
                </div>
                <div className='flex justify-between text-[14px] mt-5'>
                  <div>Earned</div>
                  <div>
                    {staking?.start_timestamp ? (
                      parseFloat(
                        formatEther(
                          parseInt(
                            Math.min(
                              1,
                              ((staking.end_timestamp
                                ? staking.end_timestamp
                                : Date.now()) -
                                staking.start_timestamp) /
                                collections[collectionIndex]?.cycle
                            ) * collections[collectionIndex]?.reward.amount
                          )
                        )
                      ).toFixed(4) +
                      ' $INJ / ' +
                      formatEther(collections[collectionIndex].reward.amount) +
                      ' $INJ'
                    ) : (
                      <Skeleton width={120} />
                    )}
                  </div>
                </div>
                <div className='relative w-full h-2 bg-[rgba(105,_120,_219,_0.25)] rounded-full mt-1'>
                  <div
                    className='absolute h-full bg-[#6978DB] rounded-full'
                    style={{
                      width:
                        Math.min(
                          1,
                          ((staking.end_timestamp
                            ? staking.end_timestamp
                            : Date.now()) -
                            staking.start_timestamp) /
                            collections[collectionIndex]?.cycle
                        ) *
                          100 +
                        '%',
                    }}
                  ></div>
                </div>
                <div className='flex justify-between text-[#FFFA] text-[18px] font-light mt-5'>
                  <div>Staked For</div>
                  <div>Stake Rate</div>
                </div>
                <div className='flex justify-between font-gotham-black'>
                  <div>
                    {staking?.start_timestamp ? (
                      timespan.parse(
                        Math.min(
                          (staking.end_timestamp
                            ? staking.end_timestamp
                            : Date.now()) - staking.start_timestamp,
                          collections[collectionIndex]?.cycle
                        )
                      )
                    ) : (
                      <Skeleton width={120} />
                    )}
                  </div>
                  <div className='flex items-end'>
                    {staking?.start_timestamp ? (
                      <>
                        {formatEther(
                          BigInt(collections[collectionIndex].reward.amount)
                        )}
                        &nbsp;$INJ
                        <div className='text-[10px] ml-1 mb-1'>
                          /&nbsp;
                          {timespan.parse(collections[collectionIndex].cycle)}
                        </div>
                      </>
                    ) : (
                      <Skeleton width={100} />
                    )}
                  </div>
                </div>
                {staking?.start_timestamp && (
                  <button
                    className='sm:w-fit w-full border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none mt-3 font-gotham-black'
                    onClick={async () => {
                      await executeContract(STAKING_CONTRACT, {
                        claim_reward: {
                          index: staking.staking_index,
                        },
                      });
                    }}
                  >
                    CLAIM
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='w-full text-center mt-20'>Please connect wallet.</div>
      )}
    </>
  );
};

export default Stake;
