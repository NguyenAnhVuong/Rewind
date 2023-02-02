import React, { useState } from 'react';
import { User } from '../../models';
import { Avatar, Rate, Input } from 'antd';
import { BiMessageSquareEdit } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import moment from 'moment';

const { TextArea } = Input;

type Props = {
  content: string;
  rating: number;
  user: User;
  created_at: string;
  updated_at: string;
  commentId: number;
  handleDeleteComment: (commentId: number) => void;
  handleEditComment: (commentId: number, rating: number, content: string) => void;
};

const CommentItem: React.FC<Props> = ({
  content,
  rating,
  user,
  created_at,
  updated_at,
  commentId,
  handleDeleteComment,
  handleEditComment,
}) => {
  const { name, avatar, id } = user;

  const user_id = useSelector((state: RootState) => state.auth.id);
  const [isEdit, setIsEdit] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  const [editContent, setEditContent] = useState(content);

  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditRating(rating);
    setEditContent(content);
  }

  return (
    <div className='mt-5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Avatar src={`/images/${avatar}`} size='small' />
          <strong className='ml-2 text-lg'>{name}</strong>
        </div>
        {id === user_id && !isEdit && (
          <div className='flex group'>
            <BiMessageSquareEdit
              size={24}
              className={`cursor-pointer hover:text-[#43B929] mr-1`}
              onClick={() => setIsEdit(true)}
            />
            <MdDeleteOutline
              size={24}
              className={`cursor-pointer hover:text-[#D80032]`}
              onClick={() => handleDeleteComment(commentId)}
            />
          </div>
        )}
      </div>
      <Rate value={rating} disabled style={{ fontSize: '12px' }} />
      <p className='font-medium text-base'>{content}</p>
      <span className='text-gray-400 text-sm'>
        {moment(created_at).fromNow()}
      </span>
      {updated_at !== created_at && (
        <span className='text-gray-400 text-xs italic ml-2 mt-1'>
          Đã chỉnh sửa: {moment(updated_at).calendar()}
        </span>
      )}
      {id === user_id && isEdit && (
        <div className='grid grid-cols-5'>
          <TextArea
            maxLength={200}
            style={{
              height: 50,
              resize: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
            }}
            placeholder='Nhập bình luận của bạn'
            className='col-span-5'
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className='col-span-2 flex items-center'>
            <span className='font-bold text-sm'>Đánh giá: </span>
            <Rate
              value={editRating}
              onChange={setEditRating}
              style={{ fontSize: '14px' }}
            />
          </div>
          <button
            className={`ml-auto lg:ml-24 h-9 w-[4rem] mt-2 col-start-4 col-span-1 cursor-pointer rounded-xl text-white border-2 bg-[#50514F] hover:bg-[#3D3E3D]`}
            onClick={handleCancelEdit}
          >
            <span className='font-semibold text-xs'>Hủy</span>
          </button>
          <button
            className='ml-auto h-9 w-20 mt-2 col-start-5 col-span-1 cursor-pointer rounded-xl text-white border-2 bg-[#3066BE] hover:bg-[#254F93]'
            onClick={() => {
              handleEditComment(commentId, editRating, editContent);
              setIsEdit(false);
            }}
          >
            <span className='font-semibold text-xs'>Update</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
