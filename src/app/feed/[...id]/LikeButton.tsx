'use client';
import { Button } from '@/components/ui/button';
import { createOrDeleteLike, deleteAllLikes, getAllLikes } from '@/server/actions/projects';
import { cn } from '@/utils/cn';
import { LucideTriangle } from 'lucide-react';
import { useState } from 'react';

function LikeButton({
  likesCount,
  isLiked,
  projectId,
}: {
  likesCount: number;
  isLiked: boolean;
  projectId: number;
}) {
  console.log(likesCount, isLiked, projectId)
  const [likes, setLikes] = useState(likesCount);
  const [liked, setLiked] = useState(isLiked);

  const handleClick = async () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
    await createOrDeleteLike(projectId);
    // await getAllLikes();
    // await deleteAllLikes();
  };

  const variant = liked ? 'outline' : 'brand';

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
            liked ? 'fill-brand stroke-brand' : 'fill-white stroke-white',
            'transition-all duration-300',
          )}
        />
        <span className="hidden md:block">{liked ? 'Upvoted' : 'Upvote'}</span>
        {likes}
      </Button>
    </>
  );
}

export default LikeButton;
