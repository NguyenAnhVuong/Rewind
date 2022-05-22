import { Button, Checkbox, Modal, notification } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import { BsFillCloudUploadFill } from 'react-icons/bs';
import axiosClient from '../../axiosClient';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useParams } from 'react-router-dom';

type Props = {
  edit: boolean;
}

const CUReview = ({ edit }: Props) => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const reviews = useSelector((state: RootState) => state.review.reviews);
  const params = useParams();
  const id = Number(params.id);
  const review = reviews.find(review => review.id === id);

  useEffect(() => {
    if (review && edit) {
      setAvatar(review.avatar);
      setName(review.name);
      setAddress(review.address);
      setPhone(review.phone);
      setDescription(review.description);
      setImages(review.images);
    } else {
      setAvatar('');
      setName('');
      setAddress('');
      setPhone('');
      setDescription('');
      setImages([]);
    }
  }, [edit])

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpAvatar = async (event: any) => {
    const avatar = event.target.files;
    const fileAvatar = new FormData();
    fileAvatar.append("images[]", avatar[0]);
    const res = await axiosClient.post("/api/upload", fileAvatar);
    setAvatar(res.data.images[0]);
  }

  const handleUpImages = async (e: any) => {
    const images = e.target.files;
    const fileImages = new FormData();
    for (let i = 0; i < images.length; i++) {
      fileImages.append("images[]", images[i]);
    }
    const res = await axiosClient.post("/api/upload", fileImages);
    setImages(state => [...state, ...res.data.images]);
  }

  const handleDeleteImage = (image: string) => {
    const newImages = images.filter(img => img !== image);
    setImages(newImages);
  }

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message,
      top: 56,
      placement: "top",
    });
  };

  const handleCreateReview = async () => {
    const newReview = {
      name,
      address,
      phone,
      description,
      avatar,
      images
    };
    try {
      const res = await axiosClient.post("/api/restaurant/add", newReview);
      if (res && res.data && res.data.status) {
        setAvatar('');
        setName('');
        setAddress('');
        setPhone('');
        setDescription('');
        setImages([]);
      }
      openNotification('success', 'Thêm bài review thành công');
    } catch (error) {
      openNotification('error', 'Thêm bài review thất bại');
    }
  }

  const handleUpdateReview = async () => {
    const updateReview = {
      name,
      address,
      phone,
      description,
      avatar,
      images
    };
    try {
      const res = await axiosClient.put(`/api/restaurant/update/${id}`, updateReview);
      if (res && res.data && res.data.status) {
        openNotification('success', 'Cập nhật bài review thành công');
      }
    } catch (error) {
      openNotification('error', 'Cập nhật bài review thất bại');
    }

  }


  return (
    <div className='xl:flex xl:justify-center'>
      <div className='xl:w-[1200px] lg:grid lg:grid-cols-2 mt-5 lg:mt-10'>
        <div className='flex flex-col items-center px-4 mt-5'>
          <div className='w-full flex justify-center h-full'>
            {
              avatar ?
                <>
                  <label htmlFor="avatar" className='w-60 h-36 lg:h-60 lg:w-96 flex flex-col justify-center items-center cursor-pointer border overflow-hidden rounded-md'>
                    <img src={`/images/${avatar}`} className='object-cover lg:h-60 lg:w-96' alt='' />
                  </label>
                  <input hidden id="avatar" type='file' onChange={(e) => handleUpAvatar(e)}>
                  </input>
                </>
                :
                <>
                  <label htmlFor="avatar" className='h-36 lg:h-60 lg:w-96 flex flex-col justify-center items-center cursor-pointer border border-black rounded-md'>
                    <BsFillCloudUploadFill size={28} />
                    <span className='p-3'>Chọn một ảnh làm ảnh đại diện</span>
                  </label>
                  <input hidden id="avatar" type='file' onChange={(e) => handleUpAvatar(e)}>
                  </input>
                </>
            }

          </div>
        </div>

        <div className='flex flex-col p-4'>
          <div className=''>
            <input className='border border-black p-2 w-full rounded-md' type="text" placeholder='Tên nhà hàng' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='mt-6'>
            <input className='border border-black p-2 w-full rounded-md' type="text" placeholder='Địa chỉ' value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className='mt-6'>
            <input className='border border-black p-2 w-full rounded-md' type="tel" placeholder='Số điện thoại' value={phone} onChange={(e) => { setPhone(e.target.value) }} />
          </div>

          <div className='mt-6'>
            <textarea className='border border-black p-2 w-full rounded-md' name="" placeholder='Viết gì đó...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <div className='flex gap-4'>
            <button className='mt-4 w-full bg-[#3BACB6] text-white p-2 rounded-3xl' type='button' onClick={showModal}>
              Ảnh mô tả
            </button>

            {
              edit ?
                <button className='mt-4 w-full bg-[#EFD345] text-white p-2 rounded-3xl' type='button' onClick={handleUpdateReview}>
                  Lưu lại
                </button>
                :
                <button className='mt-4 w-full bg-[#14C38E] text-white p-2 rounded-3xl' type='button' onClick={handleCreateReview}>
                  Thêm bài review
                </button>
            }

          </div>


        </div>

        <Modal title="Ảnh mô tả" visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <div className='grid grid-cols-2 gap-4'>
            {
              images.map((image, index) => {
                return (
                  <div className='relative h-36 flex flex-col justify-center items-center border overflow-hidden rounded-md group cursor-pointer' key={index}>
                    <div className='absolute h-full w-full group-hover:bg-[#00000080] '>
                      <span onClick={() => handleDeleteImage(image)}>
                        <MdOutlineDeleteOutline size={24} className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] hidden group-hover:block group-hover:z-10 text-white ' />
                      </span>
                    </div>
                    <img src={`/images/${image}`} className='object-cover h-full w-full' alt='' />
                  </div>
                )
              })
            }
            <div className=''>
              <label htmlFor="images" className='h-36 flex flex-col justify-center items-center cursor-pointer border border-black rounded-md'>
                <BsFillCloudUploadFill size={28} />
                <span className='p-3 text-center'>Chọn ảnh mô tả</span>
              </label>
              <input hidden id="images" type='file' multiple onChange={(e) => handleUpImages(e)}>
              </input>
            </div>
          </div>
        </Modal>
      </div>
    </div>

  )
}

export default CUReview