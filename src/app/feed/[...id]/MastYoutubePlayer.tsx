'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export default function FancyThumbnailPlayer(props: {
  videoId: string;
  thumbnailSrc?: string | null;
  // videoSrc: string;
  // autoplay: boolean;
}) {
  const videoRef = useRef<HTMLIFrameElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [thumbnailOpacity, setThumbnailOpacity] = useState(100);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        setThumbnailOpacity(0);
        // setTimeout(() => {
        //   if (videoRef.current) {
        //     void videoRef.current.play();
        //   }
        // }, 500);
      }}
      onMouseLeave={() => {
        // void videoRef.current?.pause();
        setThumbnailOpacity(1);
      }}
      className="group relative mb-8 aspect-video w-full max-w-lg overflow-hidden rounded-sm duration-200 hover:scale-110"
    >
      {props.thumbnailSrc && (
        <Image
          width={250}
          height={250}
          alt=""
          src={
            'https://images.unsplash.com/photo-1701007633412-e519020c7c22?q=80&w=3640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          style={{ opacity: thumbnailOpacity }}
          className="absolute left-0 top-0 z-[15] h-full w-full object-cover transition-opacity"
        />
      )}

      <iframe
        ref={videoRef}
        className="aspect-video h-full w-full max-w-2xl overflow-hidden rounded-lg"
        // className="absolute left-0 top-0 z-[14] h-full w-full object-cover"
        src={'https://www.youtube.com/embed/' + props.videoId}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      {/* <video
        controls
        muted
        loop
        src={props.videoSrc}
        autoPlay={false}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      /> */}
    </div>
  );
}
