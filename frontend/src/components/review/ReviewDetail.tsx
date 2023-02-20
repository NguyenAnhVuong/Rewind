import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../app/store';
import { Carousel, Image, Modal, notification, Rate, Input, Pagination } from 'antd';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { reviewActions } from '../../features/review';
import axios from 'axios';
import axiosClient from '../../axiosClient';
import { Comment } from '../../models';
import CommentItem from './CommentItem';
import paginate from '../../utils/utils';

const { TextArea } = Input;

const { confirm } = Modal;
type Props = {};

type OptionValue = {
  comments: Array<Comment>;
  rating: number;
};

const ReviewDetail = (props: Props) => {
  const params = useParams();
  const id = Number(params.id);
  let reviews = useSelector((state: RootState) => state.review.reviews);
  const user_id = useSelector((state: RootState) => state.auth.id);
  const user = useSelector((state: RootState) => state.auth);
  const review = reviews.find((review) => review.id === id);
  const [images, setImages] = useState<Array<string>>([]);
  const [dataRestaurant, setDataRestaurant] = useState<OptionValue>();
  const [dataComment, setDataComment] = useState<Array<Comment>[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref: any = useRef();
  const [visible, setVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getDetailReviewFromApi = async () => {
      try {
        const { data } = await axios.get(`/api/restaurant/details/${id}`);
        if (data.status) {
          setImages([
            data.data.restaurant.avatar,
            ...data.data.restaurant.images,
          ]);
          setDataRestaurant(data.data.restaurant);
          setDataComment(paginate(data.data.restaurant.comments));
        }
      } catch (e) {
        console.log('e: ', e);
      }
    };
    getDetailReviewFromApi();
  }, [id, review]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const handleComment = async () => {
    if (rating === 0) {
      showModal();
    } else {
      const dataCommentPost = {
        restaurant_id: id,
        user_id,
        content: comment,
        rating,
      }
      try {
        const { data } = await axiosClient.post('/api/comments', dataCommentPost);
        if (data.status && dataRestaurant) {
          const newComment = {
            id: data.data.id,
            comment,
            rating,
            user,
            created_at: data.data.created_at,
            updated_at: data.data.updated_at,
            restaurant_id: id,
          };
          dataRestaurant.comments.unshift(newComment);
          if (dataRestaurant.comments.length === 1) {
            dataRestaurant.rating = rating;
          } else {
            dataRestaurant.rating = (dataRestaurant.rating * dataRestaurant.comments.length + rating) / (dataRestaurant.comments.length + 1);
          }
          setDataComment(paginate(dataRestaurant.comments));
          setComment('');
          setRating(0);
          openNotification('success', 'Đã gửi bình luận thành công');
        }
      } catch (error) {
        
      }
    }
  };

  const handleCancel = async () => {
    setComment('');
    setRating(0);
  };

  const openNotification = (type: 'success' | 'error', message: string) => {
    notification[type]({
      message,
      top: 56,
      placement: 'top',
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
            reviews = reviews.filter((review) => review.id !== id);
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
  };

  const goToSlide = (index: Number) => {
    ref.current.goTo(index);
  };

  const handleEditComment = async (idComment: number, rating: number, content: string) => { 
    try {
      const { data } = await axiosClient.patch(`/api/comments/${idComment}`, { content, rating, restaurant_id: id });
      if (data.status && dataRestaurant) {
        const comment = dataRestaurant.comments.find((comment) => comment.id === idComment);
        if (comment) {
          dataRestaurant.rating = (dataRestaurant.rating * dataRestaurant.comments.length - comment.rating + rating) / dataRestaurant.comments.length;
          comment.comment = content;
          comment.rating = rating;
          setDataComment(paginate(dataRestaurant.comments));
          openNotification('success', 'Cập nhật bình luận thành công');
        }
      }
    } catch (error) {
      console.log(error);
      openNotification('error', 'Cập nhật bình luận thất bại');
    }
  }
  
  const handleDeleteComment = (id: number) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa đánh giá không',
      async onOk() {
        try {
          const { data } = await axiosClient.delete(`/api/comments/${id}`);
          if (data.status && dataRestaurant) {
            const indexComment = dataRestaurant.comments.findIndex((comment) => comment.id === id);
            dataRestaurant.comments.splice(indexComment, 1);
            dataRestaurant.rating = (dataRestaurant.rating * (dataRestaurant.comments.length + 1) - rating) / dataRestaurant.comments.length;
            setDataComment(paginate(dataRestaurant.comments));
            openNotification('success', 'Xóa bình luận thành công');
          }
          
        } catch (error) {
            console.log(error);
            openNotification('error', 'Xóa bình luận thất bại');
        }
        
      },
    });
  }

  return (
    <div className='lg:flex lg:justify-center lg:mt-10 lg:p-4'>
      <div className='lg:w-[1200px] lg:grid lg:grid-cols-10'>
        <div className='lg:col-span-6 lg:grid lg:grid-cols-6 lg:pt-4'>
          <div className='hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-2'>
            {images.map((image, index) => {
              return (
                <div
                  className='lg:relative lg:pt-[56.25%] lg:w-full'
                  key={index}
                  onClick={() => goToSlide(index)}
                >
                  <img
                    className='lg:absolute lg:rounded-lg lg:cursor-pointer lg:object-cover lg:h-full lg:w-full lg:top-0 lg:left-0 lg:right-0 lg:bottom-0'
                    src={`/images/${image}`}
                    alt=''
                    key={index}
                  />
                </div>
              );
            })}
          </div>
          <div className='lg:col-span-5 lg:px-2'>
            <Carousel
              className='lg:rounded-lg lg:overflow-hidden'
              dots={false}
              autoplay={true}
              ref={ref}
            >
              {images.map((image, index) => {
                return (
                  <div className='max-h-[329.0625px]' key={index}>
                    <Image
                      className='lg:rounded-lg lg:overflow-hidden'
                      preview={{ visible: false }}
                      onClick={() => {
                        setCurrentImage(index);
                        setVisible(true);
                      }}
                      src={`/images/${image}`}
                      key={index}
                      width={'100%'}
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
          <div className='lg:col-span-5 break-words mt-10'>
            <h1 className='mt-3 text-3xl font-extrabold'>Bình luận</h1>
            {dataRestaurant?.comments.length && dataComment ? (
              <>
                {dataComment[currentPage - 1].map((comment: Comment, index) => {
                  return (
                    <CommentItem
                      content={comment.comment}
                      user={comment.user}
                      rating={comment.rating}
                      created_at={comment.created_at}
                      updated_at={comment.updated_at}
                      commentId={comment.id}
                      handleDeleteComment={handleDeleteComment}
                      handleEditComment={handleEditComment}
                      key={index}
                    />
                  );
                })}
                <div className='my-5'>
                  {dataRestaurant.comments.length > 5 && (
                    <Pagination
                      onChange={setCurrentPage}
                      defaultCurrent={1}
                      total={dataRestaurant.comments.length}
                      defaultPageSize={5}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <p className='text-lg my-3 font-semibold'>
                  Chưa có bình luận nào
                </p>
              </>
            )}
            {dataRestaurant?.comments.findIndex(
              (comment) => comment.user.id === user.id
            ) === -1 && user.id !== 0 && (
              <div className='grid grid-cols-5'>
                <TextArea
                  style={{
                    height: 120,
                    resize: 'none',
                    marginTop: 10,
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                  placeholder='Nhập bình luận của bạn'
                  className='col-span-5'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={200}
                />
                {rating !== 0 && (
                  <div className='mt-5 col-span-2'>
                    <h3 className='font-bold text-base'>Đánh giá: </h3>
                    <Rate value={rating} onChange={setRating} />
                  </div>
                )}
                <button
                  className={`${
                    rating === 0 || !comment ? 'hidden' : ''
                  } h-9 col-start-4 col-span-1 mt-5 cursor-pointer rounded-xl text-white border-2 bg-[#50514F] hover:bg-[#3D3E3D]`}
                  onClick={handleCancel}
                >
                  <span className='font-semibold'>Hủy</span>
                </button>
                <button
                  className='h-9 col-start-5 col-span-1 mt-5 cursor-pointer rounded-xl text-white border-2 bg-[#3066BE] hover:bg-[#254F93]'
                  onClick={handleComment}
                >
                  <span className='font-semibold'>Bình luận</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='lg:col-span-4 p-4 text-base font-medium lg:flex lg:flex-col lg:justify-between'>
          <div>
            <h2 className='text-2xl font-bold uppercase'>{review?.name}</h2>
            <strong className='flex items-center'>
              Rating:{' '}
              {dataRestaurant!?.comments.length > 0 ? (
                <Rate allowHalf value={dataRestaurant!.rating} disabled />
              ) : (
                <p className='ml-1 my-0'>Chưa có đánh giá</p>
              )}
            </strong>
            <p>Địa chỉ: {review?.address}</p>
            <p>Số điện thoại: {review?.phone}</p>
            <p className='min-h-[128px]'>{review?.description}</p>
            <p className='mt-8'>Chia sẻ bởi: {review?.user}</p>
          </div>

          <div className='fixed bottom-8 right-2 md:bottom-16 md:right-6 lg:static lg:flex lg:justify-evenly '>
            {user_id === review?.user_id && (
              <div className='rounded-full p-3 bg-[#EFD345] border mb-2 md:mb-4 lg:p-2 lg:w-[48%] '>
                <Link
                  className='text-black hover:text-black lg:flex'
                  to={`/review/edit/${review?.id}`}
                >
                  <AiOutlineEdit size={24} />
                  <span className='hidden lg:block lg:ml-4'>
                    Sửa bài review
                  </span>
                </Link>
              </div>
            )}
            {(user_id === review?.user_id || user_id === 2) && (
              <div className='lg:w-[48%] '>
                <button
                  className='rounded-full p-3 bg-[#EB5353] border lg:p-2 lg:w-full lg:flex'
                  onClick={showDeleteConfirm}
                >
                  <AiOutlineDelete size={24} />
                  <span className='hidden lg:block lg:ml-4'>
                    Xóa bài review
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis),
            current: currentImage,
          }}
        >
          {images.map((image, index) => {
            return <Image src={`/images/${image}`} key={index} />;
          })}
        </Image.PreviewGroup>
      </div>
      <Modal
        title='Chất lượng nhà hàng'
        centered
        visible={isModalOpen}
        footer={null}
        onCancel={hideModal}
        wrapClassName='modal-style'
      >
        <span className='font-bold text-base'>Đánh giá: </span>
        <Rate
          value={rating}
          onChange={(rate: number) => {
            setRating(rate);
            hideModal();
          }}
          style={{ fontSize: '12px' }}
        />
      </Modal>
    </div>
  );
};
export default ReviewDetail;
