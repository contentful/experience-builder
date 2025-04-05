'use client';

import React from 'react';
import { Card, Skeleton, Alert } from 'antd';
import { useMovie } from '@/context/MovieContext';

const { Meta } = Card;

interface MovieCardProps {
  movieId: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movieId }) => {
  const { data, loading, error } = useMovie(movieId);

  if (loading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={<img src={data.Poster} style={{ height: '400px', objectFit: 'cover' }} />}>
      <Meta title={data.Title} description={data.Plot} />
    </Card>
  );
};

export default MovieCard;
