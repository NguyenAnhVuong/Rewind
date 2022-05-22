import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MdOutlineClose } from 'react-icons/md';
import { HiOutlineMenu } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import Register from '../auth/Register';
import Login from '../auth/Login';
import { authActions } from '../../features/auth';
import axiosClient from '../../axiosClient';
import { Link, useLocation, useNavigate } from 'react-router-dom';
type Props = {}

const Header = (props: Props) => {
  const location = useLocation();
  const [windowSize, setWindowSize] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formLogin, setFormLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axiosClient.post('/api/auth/logout');
      localStorage.removeItem('token');
      dispatch(authActions.logout());
      if (res && res.data && res.data.status) {
        setIsOpen(false);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname]);


  return (
    <header className="flex w-full justify-center h-14 font-extrabold items-center text-primary-text shadow-header-shadow relative z-20">
      <div className='flex justify-between w-full xl:w-[1200px] px-4 h-full items-center'>
        <div>
          <Link className='text-black hover:text-black' to="/" >Rewind</Link>
        </div>
        <div className='flex items-center cursor-pointer'>
          {
            userId && isOpen && windowSize <= 1024 ?
              <MdOutlineClose size={"28px"} onClick={() => setIsOpen(false)} />
              :
              userId && windowSize <= 1024 ?
                <HiOutlineMenu size={"28px"} onClick={() => setIsOpen(true)} />
                :
                <></>
          }

          {
            !userId &&
            <>
              <div className='px-2'>
                <FiUsers size={20} />
              </div>
              <span className='text-sm' onClick={() => { showModal(); setFormLogin(true) }}>Đăng nhập</span>
            </>
          }
        </div>
        {
          !!userId && windowSize > 1024 &&
          <div className='flex h-full items-center'>
            <Link className='text-black hover:text-black min-w-fit h-full px-4 flex items-center' to="/">Trang chủ</Link>
            <Link className='text-black hover:text-black min-w-fit h-full px-4 flex items-center' to="/review/add">Viết review</Link>
            <Link className='text-black hover:text-black min-w-fit h-full px-4 flex items-center' to={`/user/${userId}`} >Các nhà hàng đã review</Link>
            <span className='min-w-fit px-4 cursor-pointer' onClick={handleLogout}>Đăng xuất</span>
          </div>
        }
      </div>
      {
        isOpen && windowSize <= 1024 &&
        <ul className='absolute top-14 left-0 w-full bg-white px-4'>
          <li className='py-2'><Link className='text-black hover:text-black' to="/review/add" >Viết review</Link></li>
          <li className='py-2'><Link className='text-black hover:text-black' to={`/user/${userId}`} >Các nhà hàng đã review</Link></li>
          <li className='py-2 cursor-pointer' onClick={handleLogout}>Đăng xuất</li>
        </ul>
      }
      {
        formLogin ?
          <Login visible={isModalVisible} setFormLogin={setFormLogin} setIsModalVisible={setIsModalVisible} handleCancel={handleCancel} />
          :
          <Register visible={isModalVisible} setFormLogin={setFormLogin} handleCancel={handleCancel} />
      }


    </header >
  )
}

export default Header