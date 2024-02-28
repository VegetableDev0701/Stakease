import { Outlet } from 'react-router-dom';
import Sidebar from './../components/Layout/Sidebar';
import TopBar from '@/components/Layout/TopBar';

const Layout = () => {
  return (
    <div className='relative flex w-full'>
      <Sidebar />
      <div className='relative flex flex-col w-stretch px-6 md:px-10 lg:px-[80px] xl:px-[120px]  w-full 2xl:w-[calc(100%_-_240px)]'>
        <TopBar />
        <Outlet />
        <div className='absolute w-[1000px] h-[1000px] bg-radial-gradient -left-[300px] -top-[500px] rounded-full opacity-20 blur-3xl -z-10'></div>
        <div className='fixed w-[1000px] h-[1000px] bg-radial-gradient -right-[300px] -bottom-[500px] rounded-full opacity-20 blur-3xl -z-10'></div>
      </div>
    </div>
  );
};

export default Layout;
