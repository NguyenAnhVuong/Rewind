import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RootState } from '../../app/store';
import { Carousel, Image, Modal, notification } from 'antd';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axiosClient from '../../axiosClient';
import { reviewActions } from '../../features/review';

const { confirm } = Modal;
type Props = {}

const ReviewDetail = (props: Props) => {
  const params = useParams();
  const id = Number(params.id);
  let reviews = useSelector((state: RootState) => state.review.reviews);
  const user_id = useSelector((state: RootState) => state.auth.id);
  const review = reviews.find(review => review.id === id);
  const [images, setImages] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref: any = useRef();
  const [visible, setVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (review) {
      setImages([review.avatar, ...review.images]);
    }
  }, [review]);

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message,
      top: 56,
      placement: "top",
    });
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Bạn có chắc là muốn xóa bài review này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Sau khi xóa sẽ không thể khôi phục lại',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const res = await axiosClient.delete(`/api/restaurant/delete/${id}`);
          if (res && res.data && res.status) {
            reviews = reviews.filter(review => review.id !== id);
            dispatch(reviewActions.getReviews(reviews));
            openNotification('success', 'Xóa bài review thành công');
            navigate('/');
          }
        } catch (error) {
          openNotification('error', 'Xóa bài review thất bại');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const goToSlide = (index: Number) => {
    ref.current.goTo(index);
  }

  return (
    <div className='lg:flex lg:justify-center lg:mt-10 lg:p-4'>
      <div className='lg:w-[1200px] lg:grid lg:grid-cols-10'>
        <div className='lg:col-span-6 lg:grid lg:grid-cols-6 lg:pt-4'>
          <div className='hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-2'>
            {
              images.map((image, index) => {
                return (
                  <div className='lg:relative lg:pt-[56.25%] lg:w-full' onClick={() => goToSlide(index)}>
                    <img
                      className='lg:absolute lg:rounded-lg lg:cursor-pointer lg:object-cover lg:h-full lg:w-full lg:top-0 lg:left-0 lg:right-0 lg:bottom-0'
                      src={`/images/${image}`}
                      alt=""
                      key={index}
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='lg:col-span-5 lg:px-2'>
            <Carousel className='lg:rounded-lg lg:overflow-hidden' dots={false} autoplay={true} ref={ref}>
              {
                images.map((image, index) => {
                  return (
                    <div className='max-h-[329.0625px]'>
                      <Image
                        className='lg:rounded-lg lg:overflow-hidden'
                        preview={{ visible: false }}
                        onClick={() => { setCurrentImage(index); setVisible(true); }}
                        src={`/images/${image}`}
                        key={index}
                        width={'100%'}
                      />
                    </div>
                  )
                })
              }
            </Carousel>
          </div>
        </div>

        <div className='lg:col-span-4 p-4 text-base font-medium lg:flex lg:flex-col lg:justify-between'>
          <div>
            <h2 className='text-2xl font-bold uppercase'>{review?.name}</h2>
            <p>Địa chỉ: {review?.address}</p>
            <p>Số điện thoại: {review?.phone}</p>
            <p className='min-h-[128px]'>{review?.description}</p>
            <p className='mt-8'>Chia sẻ bởi: {review?.user}</p>
          </div>

          <div className='fixed bottom-8 right-2 md:bottom-16 md:right-6 lg:static lg:flex lg:justify-evenly '>
            {
              (user_id === review?.user_id) &&
              <div className='rounded-full p-3 bg-[#EFD345] border mb-2 md:mb-4 lg:p-2 lg:w-[48%] '>
                <Link className='text-black hover:text-black lg:flex' to={`/review/edit/${review?.id}`}>
                  <AiOutlineEdit size={24} />
                  <span className='hidden lg:block lg:ml-4'>Sửa bài review</span>
                </Link>
              </div>
            }
            {
              (user_id === review?.user_id || user_id === 2) &&
              <div className='lg:w-[48%] '>
                <button className='rounded-full p-3 bg-[#EB5353] border lg:p-2 lg:w-full lg:flex' onClick={showDeleteConfirm}>
                  <AiOutlineDelete size={24} />
                  <span className='hidden lg:block lg:ml-4'>Xóa bài review</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div >
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis), current: currentImage }}>
          {
            images.map((image, index) => {
              return (
                <Image
                  src={`/images/${image}`}
                  key={index}
                />
              )
            })
          }
        </Image.PreviewGroup>
      </div>
    </div>

  );
}
export default ReviewDetail;