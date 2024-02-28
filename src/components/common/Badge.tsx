import React from 'react';

const Badge = (props: { children: React.ReactNode }) => {
  return (
    <div className='bg-[#6978DB55] border border-[#FFFFFF10] rounded-full text-[#6978DB] ml-4 px-4 py-1 w-fit h-fit leading-none font-inter'>
      {props.children}
    </div>
  );
};

export default Badge;
