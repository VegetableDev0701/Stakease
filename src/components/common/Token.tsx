import { useEffect, useState } from 'react';
import NFTMedia from './NFTMedia';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { setCollectionToken } from '@/app/stores/stakingSlice';

const Token = ({
  collectionIndex,
  collection,
  tokenId,
  skeletonStyle,
}: {
  collectionIndex: number;
  collection: string;
  tokenId: string;
  skeletonStyle: string;
}) => {
  const dispatch = useDispatch();
  const collectionTokens: any = useSelector(
    (state) => state.staking.collectionTokens
  );
  const [metadata, setMetadata] = useState(null);
  useEffect(() => {
    void (async function () {
      if (collection && tokenId) {
        let tokenData = collectionTokens[collectionIndex]?.[tokenId];
        if (!tokenData) {
          tokenData = await (
            await fetch(`/api/token/${collection}/${tokenId}`)
          ).json();
          dispatch(
            setCollectionToken({
              collectionIndex,
              token_id: tokenId,
              token: tokenData,
            })
          );
        }
        setMetadata(tokenData?.metadata);
      }
    })();
  }, [collection, tokenId]);
  return (
    <div>
      {metadata ? (
        <>
          <NFTMedia metadata={metadata} />
        </>
      ) : (
        // <img
        //   src={token?.token_uri}
        //   alt='nft image'
        //   className='w-full rounded border-2 border-transparent group-hover:border-[#6978DB] aspect-square'
        // />
        <Skeleton className={skeletonStyle} />
      )}
    </div>
  );
};

export default Token;
