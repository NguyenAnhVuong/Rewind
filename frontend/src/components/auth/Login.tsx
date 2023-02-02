import { Input, Modal } from 'antd'
import axios from 'axios'
import React, { MouseEvent, useState } from 'react'
import { useDispatch } from 'react-redux';
import { authActions } from '../../features/auth';
import { User } from '../../models';

type Props = {
    visible: boolean;
    setIsModalVisible: (value: boolean) => void
    setFormLogin: (value: boolean) => void;
    handleCancel: () => void;
}

const Login = ({ visible, setFormLogin, setIsModalVisible, handleCancel }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async (e: MouseEvent) => {
        e.preventDefault();
        const acc = {
            email,
            password
        }
        try {
            const res = await axios.post('/api/auth/login', acc);
            if (res && res.data && res.data.status) {
                setIsModalVisible(false);
                const user: User = {
                    id: res.data.user.id,
                    email: res.data.user.email,
                    name: res.data.user.name,
                    avatar: res.data.user.avatar,
                }
                dispatch(authActions.login(user));
                localStorage.setItem("token", res.data.token);
            }
        }
        catch (err) {
            setErr('Sai tài khoản hoặc mật khẩu');
        }
    }

    return (
        <Modal title="Đăng nhập" visible={visible} footer={null} onCancel={handleCancel}>
            <form className='flex flex-col text-base'>
                <Input className='border border-black h-10 p-2 mb-4 rounded-sm outline-none' type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                <Input.Password className='border border-black h-10 p-2 mb-4 rounded-sm outline-none' placeholder='Mật khẩu' onChange={(e) => setPassword(e.target.value)} />
                <span className='text-red-600 font-medium'>{err}</span>
                <button className='mt-4 w-full bg-[#14C38E] text-white p-2 rounded-3xl' type='submit' onClick={(e) => handleLogin(e)}>Đăng nhập</button>
                <div className='text-center mt-4'>
                    <span>Chưa có tài khoản?</span>
                    <span className='mx-2 text-[#14C38E] cursor-pointer' onClick={() => setFormLogin(false)}>Đăng ký</span>
                </div>
            </form>
        </Modal>
    )
}

export default Login