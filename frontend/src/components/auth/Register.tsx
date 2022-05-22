import { Modal, notification } from 'antd'
import axios from 'axios'
import { MouseEvent, useState } from 'react'

type Props = {
  visible: boolean;
  setFormLogin: (value: boolean) => void;
  handleCancel: () => void;
}

const Register = ({ visible, setFormLogin, handleCancel }: Props) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message,
      top: 56,
      placement: "top",
    });
  };
  const handleRegister = async (e: MouseEvent) => {
    e.preventDefault();
    const newUser = {
      name,
      email,
      password
    }
    try {
      const res = await axios.post('/api/auth/register', newUser);
      if (res && res.data && res.data.status) {
        setFormLogin(true);
        openNotification('success', 'Đăng ký tài khoản thành công!');
      }

    } catch (err) {
      setErr('Email này đã được sử dụng');
    }
  }
  return (
    <Modal title="Đăng ký" visible={visible} footer={null} onCancel={handleCancel}>
      <form className='flex flex-col text-base'>
        <input className='border border-black h-10 p-2 mt-4 rounded-sm outline-none' type="text" placeholder='Họ và tên' value={name} onChange={(e) => setName(e.target.value)} />

        <input className='border border-black h-10 p-2 mt-4 rounded-sm outline-none w-full' type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        {err && <span className='text-red-500'>{err}</span>}
        <input className='border border-black h-10 p-2 mt-4 rounded-sm outline-none' type="password" placeholder='Mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='mt-4 w-full bg-[#14C38E] text-white p-2 rounded-3xl' type='submit' onClick={(e) => handleRegister(e)}>Đăng ký</button>
        <div className='text-center mt-4'>
          <span>Đã có tài khoản?</span>
          <span className='mx-2 text-[#14C38E] cursor-pointer' onClick={() => setFormLogin(true)}>Đăng nhập</span>
        </div>
      </form>
    </Modal>
  )
}

export default Register