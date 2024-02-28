import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Layout from '@/pages/Layout';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Staking from '@/pages/Stake';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCollectionToken,
  setCollections,
  setStakings,
  setAllTokens,
  setUnstakedTokens,
  setOwner,
  setUnstakeFee,
} from './app/stores/stakingSlice';
import { useWalletStore } from './hooks';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { CHAIN_NAME, STAKING_CONTRACT } from './app/utils/constants';
import { fromBase64, toBase64 } from '@injectivelabs/sdk-ts';
import { setAvatar, setName } from './app/stores/configSlice';
import { useChain } from '@cosmos-kit/react';
import Admin from './pages/Admin';
import 'swiper/css';

const MAX_LIMIT = 100;

const App = () => {
  const { queryContract } = useWalletStore();
  const { address, getCosmWasmClient } = useChain(CHAIN_NAME);
  const dispatch = useDispatch();
  const name = useSelector((state) => state.config.name);
  const avatar = useSelector((state) => state.config.avatar);
  const collections = useSelector((state: any) => state.staking.collections);
  const stakings = useSelector((state: any) => state.staking.stakings);
  const unstakedTokens = useSelector((state) => state.staking.unstakedTokens);
  useEffect(() => {
    void (async () => {
      const response = await queryContract(STAKING_CONTRACT, {
        get_config: {},
      });
      dispatch(setOwner(response.owner));
      dispatch(setUnstakeFee(response.unstake_fee));
    })();
    void (async () => {
      const saved_name = localStorage.getItem('name');
      if (saved_name) {
        dispatch(setName(saved_name));
      } else {
        localStorage.setItem('name', name);
      }
      const saved_avatar = localStorage.getItem('avatar');
      if (saved_avatar) {
        dispatch(setAvatar(saved_avatar));
      } else {
        localStorage.setItem('avatar', avatar);
      }

      let collections = await queryContract(STAKING_CONTRACT, {
        get_collections: {},
      });
      collections = collections.filter(
        (collection) => collection.is_whitelisted == true
      );
      collections = await Promise.all(
        collections.map(async (collection, index) => {
          const metadata = await queryContract(collection.address, {
            contract_info: {},
          });
          const num_tokens = await queryContract(collection.address, {
            num_tokens: {},
          });
          // let tokens = [];
          // await Promise.all(
          //   [...new Array(Math.ceil(collection.num_tokens / MAX_LIMIT))].map(
          //     async (_, index) => {
          //       const response = await queryContract(collection.address, {
          //         all_tokens: {
          //           start_after: (index * MAX_LIMIT).toString(),
          //           limit: MAX_LIMIT,
          //         },
          //       });
          //       tokens = tokens.concat(response.tokens);
          //     }
          //   )
          // );
          let tokenIds = [];
          let tokens = [];
          let start_after = 0;
          do {
            let response = await queryContract(collection.address, {
              tokens: {
                owner: STAKING_CONTRACT,
                start_after: start_after.toString(),
                limit: MAX_LIMIT,
              },
            });
            start_after = response.ids[response.ids.length - 1];
            tokens = response.ids || response.tokens;
            tokenIds = tokenIds.concat(tokens);
          } while (tokens.length > 0);
          const collectionData = await (
            await fetch(`/api/collection/${collection.address}`)
          ).json();
          let pfp = collectionData?.pfp;
          if (!pfp) {
            const response = await queryContract(collection.address, {
              all_tokens: {
                start_after: '0'.toString(),
                limit: MAX_LIMIT,
              },
            });
            const token = await queryContract(collection.address, {
              nft_info: { token_id: response?.ids[0] },
            });
            const token_uri = token?.token_uri.replace(
              'ipfs://',
              'https://ipfs.io/ipfs/'
            );
            const token_metadata = await (await fetch(token_uri)).json();
            pfp =
              token_metadata.media ||
              token_metadata.image ||
              token_metadata.animation_url;
            pfp = pfp.replace('ipfs://', 'https://ipfs.io/ipfs/');
          }
          return {
            ...collection,
            cycle: Number(collection.cycle) * 1000,
            index,
            num_tokens: num_tokens.count,
            staked: tokenIds.length,
            pfp: { media: pfp },
            ...metadata,
          };
        })
      );
      dispatch(setCollections(collections));
      /*collections.map(async (collection, collectionIndex) => {
        let tokens = [];
        let start_after = 0;
        for (
          let index = 0;
          index < Math.ceil(collection.num_tokens / MAX_LIMIT);
          index++
        ) {
          const response = await queryContract(collection.address, {
            all_tokens: {
              start_after: start_after.toString(),
              limit: MAX_LIMIT,
            },
          });
          tokens = tokens.concat(response.tokens);
          start_after = response.tokens[response.tokens.length - 1].token_id;
        }
        await Promise.all(
          tokens.map(async (t, index) => {
            let token_uri;
            let token_id;
            if (typeof t == 'object') {
              token_uri = t.metadata_uri || t.token_uri;
              token_id = Number(t.token_id);
            } else {
              const token = await queryContract(collection.address, {
                nft_info: { token_id: t },
              });
              token_uri = token.token_uri || token.metadata_uri;
              token_id = Number(t);
            }
            token_uri = token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const metadata = await (await fetch(token_uri)).json();
            if (metadata.media)
              metadata.media = metadata.media.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
              );
            if (metadata.image)
              metadata.image = metadata.image.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
              );
            if (metadata.animation_url)
              metadata.animation_url = metadata.animation_url.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
              );
            dispatch(
              setCollectionToken({
                collectionIndex,
                token_id,
                token: {
                  token_id: t,
                  token_uri,
                  metadata,
                },
              })
            );
          })
        );
      });*/
    })();
  }, []);
  useEffect(() => {
    const fetchData = () => {
      void (async () => {
        if (!address) return;
        if (collections[0] == undefined || collections[0] == 0) return;
        const unstakedTokens = await Promise.all(
          collections.map(async (collection, collectionIndex) => {
            let tokenIds = [];
            let tokens = [];
            do {
              let response = await queryContract(collection.address, {
                tokens: {
                  owner: address,
                  start_after: tokenIds[tokenIds.length - 1] || undefined,
                  limit: MAX_LIMIT,
                },
              });
              tokens = response.ids || response.tokens;
              tokenIds = tokenIds.concat(tokens);
            } while (tokens.length > 0);
            return {
              token_address: collection.address,
              tokens: tokenIds.map((token_id) => ({
                token_id: token_id,
                collectionIndex,
              })),
            };
          })
        );
        dispatch(setUnstakedTokens(unstakedTokens));
      })();
      void (async () => {
        if (!address) return;

        const stakings = await queryContract(STAKING_CONTRACT, {
          get_stakings_by_owner: { owner: address },
        });
        dispatch(
          setStakings(
            stakings.map((staking, index) => ({
              ...staking,
              start_timestamp: parseInt(
                Number(staking.start_timestamp) / 1000000
              ),
              end_timestamp: parseInt(Number(staking.end_timestamp) / 1000000),
              staking_index: index,
            }))
          )
        );
      })();
    };
    fetchData();
    // const timerId = setInterval(() => {
    //   // fetchData();
    // }, 30000);
    // return () => {
    //   clearInterval(timerId);
    // };
  }, [address, collections]);

  useEffect(() => {
    const allTokens = unstakedTokens.map((unstakedToken, collectionIndex) => ({
      token_address: unstakedToken.token_address,
      tokens: unstakedToken.tokens.concat(
        stakings
          .filter(
            (staking) => staking.token_address == unstakedToken.token_address
          )
          .map((staking) => ({
            token_id: staking.token_id,
            staking_state: {
              index: staking.staking_index,
              start_timestamp: staking.start_timestamp,
              end_timestamp: staking.end_timestamp,
              is_paid: staking.is_paid,
            },
            collectionIndex,
          }))
      ),
    }));
    dispatch(setAllTokens(allTokens));
  }, [unstakedTokens, stakings]);

  return (
    <div className='flex justify-center'>
      <Toaster position='top-center' reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<Dashboard />} />
            <Route path='*' element={<Layout />}>
              <Route path='home' element={<Home />} />
              <Route path='profile' element={<Profile />} />
              <Route path='stake' element={<Staking />} />
              <Route path='admin' element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
