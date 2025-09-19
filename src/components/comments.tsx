import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Rate, Avatar } from '@taroify/core';

interface CommentProps {
  userAvatar: string;
  userName: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  videos?: string[];
  productName: string;
}

const Comment: React.FC<CommentProps> = ({
  userAvatar,
  userName,
  rating,
  date,
  content,
  images,
  videos,
  productName,
}) => {
  return (
    <View className='comment-container p-4 mb-4 bg-white rounded-lg shadow-sm'>
      <View className='flex items-center mb-2'>
        <Avatar src={userAvatar} className='w-10 h-10 rounded-full' />
        <View className='ml-3 flex flex-col w-full'>
          <View className='flex flex-row'>
            <View className='text-sm text-gray-900 flex-grow'>{userName}</View>
            <View className='text-sm text-gray-500 flex-none ml-max'>{date}</View>
          </View>
          <View className='flex items-center mt-1'>
            <Rate value={rating} size={14} readonly />
          </View>
        </View>
      </View>

      <Text className='text-sm text-gray-700 mb-2'>{content}</Text>

      <View className='flex flex-wrap gap-2 mb-2'>
        {images?.map((img, index) => (
          <Image
            key={index}
            src={img}
            className='w-20 h-20 rounded-md object-cover'
            mode='aspectFill'
          />
        ))}

        {videos?.map((video, index) => (
          <video src={video} className='w-20 h-20 rounded-md object-cover' controls />
        ))}
      </View>

      <Text className='text-xs text-gray-500'>评论商品：{productName}</Text>
    </View>
  );
};

// Mock 数据
export const mockCommentData: CommentProps = {
  userAvatar: 'https://example.com/avatar.jpg',
  userName: '张三',
  rating: 4,
  date: '2025-09-12',
  content: '这款商品非常好用，性价比很高！',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  videos: ['https://example.com/video1.mp4'],
  productName: '智能手表',
};

// 调用示例
export const CommentExample: React.FC = () => {
  return <Comment {...mockCommentData} />;
};

export default Comment;
