const NFTMedia = ({ metadata }: { metadata: any }) => (
  <div>
    {metadata?.image ? (
      <img
        src={metadata?.image}
        alt='nft image'
        className='w-auto h-auto object-cover aspect-square rounded-md'
      />
    ) : metadata?.animation_url ? (
      <video
        src={metadata?.animation_url}
        alt='nft video'
        autoPlay={true}
        controls={true}
        className='w-auto h-auto object-cover aspect-square rounded-md'
      />
    ) : (
      <object
        data={metadata?.media}
        alt='nft media'
        autoPlay={true}
        controls={true}
        width={"100%"}
        height={"100%"}
        className='object-cover aspect-square rounded-md'
      />
    )}
  </div>
);

export default NFTMedia;
