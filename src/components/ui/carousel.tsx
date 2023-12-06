'use client';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type Images = {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  url: string | null;
  uploadInitiatedAt: Date;
  expiresAt: Date | null;
  publicId: string;
  projectId: number;
};

type CarouselProps = {
  imagesArr: Images[];
};

const Carousel = ({ imagesArr }: CarouselProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {imagesArr.map((image, index) => (
        <div className="mb-8 overflow-hidden rounded-sm" key={image.id}>
          <Image
            width={250}
            height={250}
            className="h-full w-full object-cover"
            src={image.url ? image.url : ''}
            alt={`image ${index + 1} `}
          />
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
