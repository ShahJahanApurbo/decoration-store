export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  cta?: string;
  image: string;
  accent?: string;
}

export interface CarouselProps {
  slides?: Slide[];
  autoplayDelay?: number;
  className?: string;
}
