import { FaCopy, FaPencilAlt, FaSearch, FaSave } from 'react-icons/fa';
import arr from '@/assets/images/arr.svg';
import swordSagaWarrior1 from '@/assets/images/sword-aga-warrior-1.png';
import Badge from '@/components/common/Badge';
import { useWalletStore } from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { formatEther, parseEther } from 'viem';
import toast from 'react-hot-toast';
import { timespan } from '@/app/services';
import { CHAIN_NAME, STAKING_CONTRACT } from '@/app/utils/constants';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { setAvatar, setName } from '@/app/stores/configSlice';
import { useChain } from '@cosmos-kit/react';
import NFTMedia from '@/components/common/NFTMedia';
import Token from '@/components/common/Token';
import { ActionHelper } from '@/service/action';
const Profile = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const { executeContract } = useWalletStore();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.config.name);
  const avatar = useSelector((state) => state.config.avatar);
  const { address } = useChain(CHAIN_NAME);
  const unstakeFee = useSelector((state) => state.staking.unstakeFee);
  const collectionIndex = useSelector((state) => state.staking.collectionIndex);
  const collections = useSelector((state) => state.staking.collections);
  const allTokens = useSelector((state) => state.staking.allTokens);
  const tokens = allTokens?.length
    ? allTokens
        .reduce(
          (s, token) =>
            s.concat(
              [...token.tokens]
                .reduce((s, t) => {
                  let idx = s.findIndex((se) => se.token_id == t.token_id);
                  if (idx >= 0) {
                    if (
                      t.staking_state != null &&
                      t.staking_state?.end_timestamp == 0
                    )
                      s[idx] = t;
                    return s;
                  } else return [...s, t];
                }, [])
                .sort((a, b) => Number(a.token_id) - Number(b.token_id))
            ),
          []
        )
        .filter(
          (t) =>
            t.token_id.indexOf(searchFilter) >= 0 ||
            (
              collections[t.collectionIndex].name +
              collections[t.collectionIndex].symbol
            ).indexOf(searchFilter) >= 0
        )
    : new Array(collections.length).fill(0);
  const stakingsState = useSelector((state) => state.staking.stakings);
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

  const [editingName, setEditingName] = useState(name);
  const [isEditingName, setIsEditingName] = useState(false);
  return (
    <>
      {address ? (
        <div className='relative w-full flex flex-col font-normal text-white'>
          <div className='w-full flex md:flex-row flex-col items-center md:items-start justify-between leading-none gap-6'>
            <img
              src={avatar}
              alt='avatar'
              className='w-[196px] h-[196px] rounded cursor-pointer object-cover'
              onClick={() => {
                document.getElementById('avatarInput')?.click();
              }}
            />
            <input
              type='file'
              name='Avatar'
              className='hidden'
              accept='image/*'
              id='avatarInput'
              multiple={false}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();

                  // Closure to capture the file information.
                  reader.onload = function (e) {
                    dispatch(setAvatar(e.target?.result));
                  };

                  // Read in the image file as a data URL.
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className='flex flex-col sm:flex-row justify-between items-center sm:items-start h-fit w-stretch gap-10'>
              <div className='flex flex-col h-full gap-7'>
                <div className='flex flex-col flex-1'>
                  <div className='text-[#AEAEB1] text-[32px] font-gotham-black'>
                    Welcome Back
                  </div>
                  <div className='text-[32px] flex items-end mt-4 font-gotham-black'>
                    {isEditingName ? (
                      <input
                        type='text'
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className='bg-transparent outline-none w-[300px]'
                        contentEditable={true}
                        readOnly={!isEditingName}
                      />
                    ) : (
                      <div>{name}</div>
                    )}
                    <div
                      className='text-[20px] ml-2 mb-2 cursor-pointer'
                      onClick={(e) => {
                        if (isEditingName) {
                          dispatch(setName(editingName));
                        }
                        setIsEditingName(!isEditingName);
                      }}
                    >
                      {isEditingName ? <FaSave /> : <FaPencilAlt />}
                    </div>
                  </div>
                  <div className='flex items-end mt-5'>
                    {`${address.slice(0, 5)}...${address.slice(-5)}`}
                    <div
                      className='text-[20px] ml-2 cursor-pointer'
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        toast.success('Copied!', {
                          icon: '📋',
                          style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                          },
                        });
                      }}
                    >
                      <FaCopy />
                    </div>
                  </div>
                </div>
                <Link
                  to='/'
                  className='w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black'
                >
                  Sign Out
                </Link>
              </div>
              <div className='flex flex-col items-center sm:items-end sm:text-right'>
                <div className='text-[32px] text-[#AEAEB1] font-gotham-black'>
                  Balance To Payout
                </div>
                <div className='text-[32px] mt-3 mb-5 font-gotham-black'>
                  {parseFloat(formatEther(totalEarned)).toFixed(1)} $INJ
                </div>
                <Link
                  to='/stake'
                  className='w-fit border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-7 py-3 text-[18px] font-medium leading-none font-gotham-black'
                >
                  CLAIM
                </Link>
              </div>
            </div>
          </div>
          <div className='flex flex-col bg-[#101219D7] border border-[#FFFFFF14] rounded-xl p-11 mt-16'>
            <div className='w-full flex justify-between gap-6 flex-col md:flex-row'>
              <div className='flex text-white items-center'>
                <div className='text-[32px] font-gotham-black'>Inventory</div>
                <Badge>{tokens?.length}</Badge>
              </div>
              <div className='flex gap-10 self-center flex-col md:flex-row'>
                <button className='w-full flex items-center justify-center md:w-fit border border-[#FFFFFF1A] bg-gradient-to-b from-[#AB71F4] to-[#6978DB] rounded px-7 py-3 text-[18px] font-medium leading-none'>
                  Highlight <img src={arr} alt='arr' className='ml-[5px]' />
                </button>
                <div className='flex items-center border border-[#FFFFFF1A] rounded'>
                  <button className='flex items-center w-fit bg-gradient-to-b to-[#AB71F4] from-[#6978DB] rounded-s p-3 text-[18px] font-medium leading-none'>
                    <FaSearch />
                  </button>
                  <input
                    type='text'
                    className='px-4 py-2 rounded-e border-none bg-transparent flex-1 outline-none placeholder:text-[#FFFA] min-w-[100px] lg:min-w-[200px]'
                    placeholder='Search By Name Or Id'
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='mt-24 flex flex-wrap gap-6 justify-between'>
              {tokens?.map((token) => (
                <div className='relative flex flex-col group w-full sm:w-[calc(50%_-_20px)] lg:w-[calc(33%_-_20px)] 2xl:w-[calc(25%_-_20px)]'>
                  <Token
                    collectionIndex={token.collectionIndex}
                    collection={collections[token?.collectionIndex]?.address}
                    tokenId={token.token_id}
                    skeletonStyle='w-full rounded border-2 border-transparent group-hover:border-[#6978DB] aspect-square'
                  />
                  <div className='mt-1 flex flex-col sm:flex-row justify-between items-center w-full p-1'>
                    <div className='flex flex-row sm:flex-col flex-1 h-0 sm:h-auto w-full sm:w-0 justify-between'>
                      <div className='text-ellipsis font-gotham-black text-left'>
                        {collections[token.collectionIndex]?.name ? (
                          collections[token.collectionIndex]?.name +
                          (isNaN(Number(token.token_id))
                            ? token.token_id
                            : ' #' + (Number(token.token_id) + 1).toString())
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                      <div className='mt-1 text-[#6978DB] text-[12px] flex items-end font-gotham-black'>
                        {collections[token.collectionIndex]?.name ? (
                          <>
                            {formatEther(
                              BigInt(
                                collections[token.collectionIndex]?.reward
                                  .amount
                              )
                            )}
                            &nbsp;$INJ
                            <div className='text-[10px] ml-[2px]'>
                              /
                              {timespan.parse(
                                collections[token.collectionIndex]?.cycle
                              )}
                            </div>
                          </>
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                    </div>
                    {token?.token_id ? (
                      <button
                        className='sm:w-fit w-full border border-[#FFFFFF1A] bg-button-normal btn-hover rounded px-3 py-3 text-[18px] font-medium leading-none mt-3 font-gotham-black'
                        onClick={async () => {
                          if (token?.staking_state)
                            await executeContract(
                              STAKING_CONTRACT,
                              {
                                unstake: {
                                  index: token.staking_state.index,
                                },
                              },
                              Date.now() -
                                parseInt(
                                  Number(token.staking_state.start_timestamp)
                                ) <
                                collections[token.collectionIndex]?.cycle
                                ? unstakeFee
                                : undefined
                            );
                          else
                            await ActionHelper(
                              collections[token.collectionIndex]?.address,
                              {
                                send_nft: {
                                  contract: STAKING_CONTRACT,
                                  token_id: token.token_id,
                                  msg: '',
                                }
                              }
                            )
                            /* await executeContract(
                              collections[token.collectionIndex]?.address,
                              {
                                send_nft: {
                                  contract: STAKING_CONTRACT,
                                  token_id: token.token_id,
                                  msg: '',
                                },
                              }
                            ); */
                        }}
                      >
                        {token?.staking_state ? 'UNSTAKE' : 'STAKE'}
                      </button>
                    ) : (
                      ''
                    )}
                    {/* <div className='cursor-pointer text-[#6978DB] text-[10px] ml-2'>
                      Stake
                    </div> */}
                  </div>
                  {token.staking_state && (
                    <div className='absolute left-1 top-1 bg-black opacity-80 rounded px-3 py-1 text-[10px] font-gotham-black'>
                      STAKED
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full text-center mt-20'>Please connect wallet.</div>
      )}
    </>
  );
};

export default Profile;
