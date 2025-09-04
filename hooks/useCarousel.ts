import { useState, useCallback } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export const useCarousel = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = useCallback((instance: SwiperType) => {
    setCurrentSlide(instance.realIndex);
  }, []);

  const goToSlide = useCallback((index: number) => {
    swiper?.slideTo(index);
  }, [swiper]);

  return {
    swiper,
    setSwiper,
    currentSlide,
    handleSlideChange,
    goToSlide,
  };
};
