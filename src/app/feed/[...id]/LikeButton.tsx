'use client';
import { Button } from '@/components/ui/button';
import { createOrDeleteLike } from '@/server/actions/projects';
import { cn } from '@/utils/cn';
import { LucideTriangle } from 'lucide-react';
import { useState } from 'react';

function UpvoteButton({
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

  const variant = isLikedByCurrentUser ? 'primaryOutline' : 'brand';

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        className="flex w-fit md:w-32 gap-3 rounded-sm"
      >
        <span className="flex items-center justify-center gap-2">
          <LucideTriangle
            size={12}
            className={cn(
              isLikedByCurrentUser
                ? 'fill-brand stroke-brand'
                : 'fill-black stroke-black',
              'transition-all duration-300',
            )}
          />
          {likes}
        </span>

        <span className="hidden md:inline-block"> | </span>
        <span
          className={`hidden md:block ${
            isLikedByCurrentUser ? 'text-brand' : ''
          }`}
        >
          {isLikedByCurrentUser ? 'Upvoted' : 'Upvote'}
        </span>
      </Button>
    </>
  );
}

export default UpvoteButton;
