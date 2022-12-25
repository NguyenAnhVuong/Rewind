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
import Logo from '../../logo.svg';
import { Menu } from 'antd';
import { Dropdown } from 'antd';
import { AiFillCaretDown } from 'react-icons/ai';
import {BiEdit, BiLogOut} from 'react-icons/bi'
import {IoRestaurantOutline} from 'react-icons/io5'
type Props = {}

const Header = (props: Props) => {
  const location = useLocation();
  const [windowSize, setWindowSize] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.id);
  const avatar = useSelector((state: RootState) => state.auth.avatar);
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
    <header className='flex w-full justify-center h-16 font-extrabold items-center text-primary-text shadow-header-shadow relative z-20'>
      <div className='flex justify-between w-full xl:w-[1200px] px-4 h-full items-center'>
        <div>
          <Link to='/'>
            <img src={Logo} alt='Logo' />
          </Link>
        </div>
        <div className='flex items-center cursor-pointer'>
          {userId && isOpen && windowSize <= 1024 ? (
            <MdOutlineClose size={'28px'} onClick={() => setIsOpen(false)} />
          ) : userId && windowSize <= 1024 ? (
            <HiOutlineMenu size={'28px'} onClick={() => setIsOpen(true)} />
          ) : (
            <></>
          )}

          {!userId && (
            <>
              <div className='px-2'>
                <FiUsers size={30} />
              </div>
              <span
                className='text-xl'
                onClick={() => {
                  showModal();
                  setFormLogin(true);
                }}
              >
                Đăng nhập
              </span>
            </>
          )}
        </div>
        {!!userId && windowSize > 1024 && (
          <div className='flex h-full items-center'>
            <Link
              className='text-black hover:text-black hover:scale-105 min-w-fit h-full px-4 flex items-center'
              to='/review/add'
            >
              <BiEdit className='w-8 h-8' />
              <span className='ml-1 text-xl'>Viết Review</span>
            </Link>
            <Link
              className='text-black hover:text-black hover:scale-105 min-w-fit h-full mx-4 flex items-center'
              to={`/user/${userId}`}
            >
              <IoRestaurantOutline className='w-8 h-8' />
              <span className='ml-1 text-xl'>Lịch Sử Review</span>
            </Link>

            <div className='flex'>
              <Link to='/profile'>
                <img
                  src={`/images/${avatar}`}
                  alt='avatar'
                  className='w-10 h-10 rounded-full object-cover'
                />
              </Link>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key='0'>
                      <Link to='/profile'>Thông tin tài khoản</Link>
                    </Menu.Item>
                    <Menu.Item key='1'>
                      <span
                        className='min-w-fit px-4 cursor-pointer flex'
                        onClick={handleLogout}
                      >
                        <BiLogOut className='w-5 h-5 mr-1' />
                        Đăng xuất
                      </span>
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <button
                  className='ant-dropdown-link'
                  onClick={(e) => e.preventDefault()}
                >
                  <AiFillCaretDown className='w-5 h-5' />
                </button>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
      {isOpen && windowSize <= 1024 && (
        <ul className='absolute top-[4.5rem] left-0 w-full bg-white px-4'>
          <li className='py-2'>
            <Link className='text-black hover:text-black flex' to='/review/add'>
              <BiEdit className='w-5 h-5' />
              <p className='ml-1'>Viết Review</p>
            </Link>
          </li>
          <li className='py-2'>
            <Link
              className='text-black hover:text-black flex'
              to={`/user/${userId}`}
            >
              <IoRestaurantOutline className='w-5 h-5' />
              <p className='ml-1'>Lịch Sử Review</p>
            </Link>
          </li>
          <li className='py-2'>
            <Link
              className='text-black hover:text-black flex'
              to='/profile'
            >
              <img
                src={`/images/${avatar}`}
                alt='avatar'
                className='w-7 h-7 rounded-full object-cover'
              />
              <p className='ml-1'>Thông tin tài khoản</p>
            </Link>
          </li>
          <li
            className='py-2 text-black cursor-pointer flex items-center'
            onClick={handleLogout}
          >
            <BiLogOut className='w-5 h-5' />
            <span className='ml-1'>Đăng xuất</span>
          </li>
        </ul>
      )}
      {formLogin ? (
        <Login
          visible={isModalVisible}
          setFormLogin={setFormLogin}
          setIsModalVisible={setIsModalVisible}
          handleCancel={handleCancel}
        />
      ) : (
        <Register
          visible={isModalVisible}
          setFormLogin={setFormLogin}
          handleCancel={handleCancel}
        />
      )}
    </header>
  );
}

export default Header