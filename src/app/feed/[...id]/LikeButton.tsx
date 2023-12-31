'use client';
import { Button } from '@/components/ui/button';
import AuthwallWrapper from '@/components/ui/sign-up-modal';
import { useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { createOrDeleteLike } from '@/server/actions/projects';
import { cn } from '@/utils/cn';
import { LucideTriangle } from 'lucide-react';
import { useState } from 'react';

function UpvoteButton({
  originalTotalLikes,
  isOriginallyLikedByUser,
  projectId,
}: {
  originalTotalLikes: number;
  isOriginallyLikedByUser: boolean;
  projectId: number;
}) {
  const { userId } = useAuth();

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
    if (!userId) {
      return;
    }

    try {
      performOptimisticLike();
      await createOrDeleteLike(projectId);
    } catch (err) {
      revertOptimisticLike();
    }
  };

  const variant = isLikedByCurrentUser ? 'primaryOutline' : 'brand';

  return (
    <AuthwallWrapper
      redirectAfterSignin={URLs.projectPage(projectId.toString())}
    >
      <Button
        onClick={handleClick}
        variant={variant}
        className="flex w-fit gap-3 rounded-full md:w-32"
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
    </AuthwallWrapper>
  );
}

export default UpvoteButton;
