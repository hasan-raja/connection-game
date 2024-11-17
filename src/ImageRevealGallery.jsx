import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const ImageRevealGallery = ({ images, onBack }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showingFullImage, setShowingFullImage] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleReveal = () => {
    if (revealedCount < images.length) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handleCelebrate = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handleShowFullImage = (index) => {
    setCurrentImageIndex(index);
    setShowingFullImage(true);
  };

  const handleHideFullImage = () => {
    setShowingFullImage(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentImageIndex < revealedCount - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    },
    onTap: () => {
      setShowingFullImage(false);
    },
    trackMouse: true, // Optional for desktop support
  });

  return (
    <div className='space-y-4 max-w-7xl mx-auto p-4'>
      <Button
        onClick={onBack}
        variant='outline'
        className='mb-4 px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 hover:bg-blue-500 hover:text-white transition-all'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Collections
      </Button>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6'>
        {images.slice(0, revealedCount).map((image, index) => (
          <div key={image.id}>
            <img
              onClick={() => handleShowFullImage(index)}
              src={image.src}
              alt={image.alt}
              className='w-full h-48 object-cover rounded-lg shadow-md'
            />
          </div>
        ))}
      </div>

      <div className='flex justify-center gap-4'>
        {revealedCount < images.length ? (
          <Button
            onClick={handleReveal}
            className='bg-blue-500 hover:bg-blue-600'>
            Reveal Next Image
          </Button>
        ) : (
          <Button
            onClick={handleCelebrate}
            className={`bg-yellow-500 hover:bg-yellow-600 transition-all ${
              showCelebration ? "scale-110" : "scale-100"
            }`}>
            <PartyPopper className='mr-2 h-4 w-4' />
            Celebrate!
          </Button>
        )}
      </div>

      {showingFullImage && (
        <div
          {...handlers}
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
          role='dialog'
          aria-modal='true'
          aria-label='full image'>
          <img
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            className='max-w-full max-h-full m-auto'
          />
          <button
            onClick={handleHideFullImage}
            className='absolute top-4 right-4 text-white text-lg'>
            Close
          </button>
        </div>
      )}

      {showCelebration && (
        <div className='fixed inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-6xl animate-bounce'>🎉</div>
        </div>
      )}
    </div>
  );
};

export default ImageRevealGallery;
