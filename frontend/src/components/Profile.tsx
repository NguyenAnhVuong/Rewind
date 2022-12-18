import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axiosClient from '../axiosClient';
import { notification, Avatar } from 'antd';
import { MdPhotoCamera } from 'react-icons/md';
import { AxiosError } from 'axios';
import { authActions } from '../features/auth';

const initialState = {
  name: '',
  password: '',
  confirmPassword: '',
};

const Profile = () => {

  const auth = useSelector((state: RootState) => state.auth);
  const reviews = useSelector((state: RootState) => state.review.reviews);
  const dispatch = useDispatch();

  const [editUser, setEditUser] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<null | string>("default_avatar.png");

  const { name, password, confirmPassword } = editUser;

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axiosClient.get('/api/user');
        setEditUser({ ...editUser, name: data.data.name });
        setAvatar(data.data.avatar);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const changeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const file = e.target.files;
      if (file) {
        const image = file[0];
        if (image.size > 2 * 1024 * 1024) {
          openNotification('error', 'Size too large.');
          return setEditUser({...editUser});
        }
        if (!image.type.match(/\/(jpg|jpeg|png|gif)$/)) {
          openNotification('error', 'Size too large.');
          return setEditUser({...editUser});

        }
        let formData = new FormData();
        formData.append('images[]', image);
        setLoading(true);
        const res = await axiosClient.post('/api/upload', formData);
        setLoading(false);
        setAvatar(res.data.images[0]);
      } else {
        openNotification('error', 'No files uploaded !');
        return setEditUser({...editUser});
      }
    } catch (error) {}
  };


  const updateInformation = async () => {
    if (!name) {
      openNotification('error', 'Please fill in name fields');
      return setEditUser({...editUser})
    }
    
    try {
      await axiosClient.put(`/api/user/${auth.id}`, { name, avatar });
      openNotification('success', 'Update Success !');
    } catch (error) {
      const err = error as AxiosError;
      const data: any = err.response?.data;
      data?.message &&
        openNotification('error', data?.message);
    }
  }

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      openNotification('error', 'Password did not match.');
      return setEditUser({...editUser})
    }

    try {
      await axiosClient.put(`/api/user/change-password`, { password });
      openNotification('success', 'Update Success !');
    } catch (error) {
      const err = error as AxiosError;
      const data: any = err.response?.data;
      data?.message &&
        openNotification('error', data?.message);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password) updatePassword();
    updateInformation();
    setTimeout(() => {
      dispatch(authActions.login({id: auth.id, name, email: auth.email}));
      setEditUser({ ...editUser, password: '', confirmPassword: '' });
    }, 3000);
  }

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message,
      top: 56,
      placement: 'top',
      duration: 2,
    });
  };

  return (
    <div className='xl:flex xl:justify-center'>
      <div className='xl:w-[1200px] lg:grid lg:grid-cols-2 items-center mt-5 lg:mt-10'>
        <div className='flex flex-col items-center px-4 mt-5'>
          <div className='w-full flex justify-center h-full relative'>
            <Avatar size={200} src={`/images/${avatar}`} />
            <input
              hidden
              id='avatar'
              name='avatar'
              type='file'
              onChange={changeAvatar}
            ></input>
            <label
              htmlFor='avatar'
              className='absolute z-50 bottom-[6.5px] w-[190px] h-[190px] lg:h-[180px] lg:w-[180px] cursor-pointer overflow-hidden rounded-full hover:bg-gray-200 hover:bg-opacity-50 group'
              hidden={false}
            >
              <MdPhotoCamera
                size={30}
                className='text-gray-500 absolute rounded-full bottom-[44%] right-[43%] cursor-pointer hidden group-hover:block'
              />
            </label>
          </div>
          <div className='mt-5'>
            <h3 className='font-bold text-base'>
              Họ và tên: <strong className='text-green-600'>{auth.name}</strong>
            </h3>
            <h3 className='font-bold text-base'>
              Email: <strong className='text-green-600'>{auth.email}</strong>
            </h3>
            <h3 className='font-bold text-base'>
              Reviews:{' '}
              <strong className='text-green-600'>{reviews.length}</strong>
            </h3>
          </div>
        </div>

        <div className='flex flex-col p-4'>
          <div className=''>
            <input
              className='border border-black p-2 w-full rounded-md'
              type='text'
              placeholder='Họ và Tên'
              name='name'
              value={name}
              onChange={handleChangeInput}
            />
          </div>

          <div className='mt-6'>
            <input
              className='border border-black p-2 w-full rounded-md'
              type='password'
              name='password'
              placeholder='New Password'
              value={password}
              onChange={handleChangeInput}
            />
          </div>

          <div className='mt-6'>
            <input
              className='border border-black p-2 w-full rounded-md'
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={handleChangeInput}
            />
          </div>

          <div className='flex gap-4'>
            <button
              className='mt-4 w-full bg-[#3BACB6] text-white p-2 rounded-3xl font-bold hover:bg-opacity-90 disabled:bg-slate-400'
              type='button'
              onClick={handleUpdate}
              disabled={
                loading ||
                !name ||
                (name === auth.name && !password && !avatar)
              }
            >
              Lưu Thay Đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;