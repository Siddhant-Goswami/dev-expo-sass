'use client';
import { Button } from '@/components/ui/button';
import { createOrDeleteLike } from '@/server/actions/projects';
import { cn } from '@/utils/cn';
import { LucideTriangle } from 'lucide-react';
import { useState } from 'react';

function LikeButton({
  originalTotalLikes: originalTotalLikes,
  isOriginallyLikedByUser,
  projectId,
}: {
  originalTotalLikes: number;
  isOriginallyLikedByUser: boolean;
  projectId: number;
}) {
  const [likes, setLikes] = useState(originalTotalLikes);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(
    isOriginallyLikedByUser,
  );

  const performOptimisticLike = () => {
    if (isLikedByCurrentUser) {
      setLikes(likes - 1);
      setIsLikedByCurrentUser(false);
    } else {
      setLikes(likes + 1);
      setIsLikedByCurrentUser(true);
    }
  };

  // TODO: Probably problematic algo, need to test
  const revertOptimisticLike = () => {
    if (isLikedByCurrentUser) {
      setLikes(likes + 1);
      setIsLikedByCurrentUser(true);
    } else {
      setLikes(likes - 1);
      setIsLikedByCurrentUser(false);
    }
  };

  const handleClick = async () => {
    try {
      performOptimisticLike();
      await createOrDeleteLike(projectId);
    } catch (err) {
      revertOptimisticLike();
    }
  };

  const variant = isLikedByCurrentUser ? 'outline' : 'brand';

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        className="flex gap-2 rounded-sm "
      >
        <LucideTriangle
          size={12}
          className={cn(
            isLikedByCurrentUser
              ? 'fill-brand stroke-brand'
              : 'fill-white stroke-white',
            'transition-all duration-300',
          )}
        />
        <span className="hidden md:block">
          {isLikedByCurrentUser ? 'Upvoted' : 'Upvote'}
        </span>
        {likes}
      </Button>
    </>
  );
}

export default LikeButton;
