import { BASE_URL } from "../configs";

 
export function CarouselDefault({ images }: { images: string[] }) {
  return (
    // image carousel
    <div className="relative w-full overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {images && images.length > 0 ? (
          images.map((img: string, idx: number) => (
            <div key={idx} className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
              <img
            //   src={img}
              src={`${BASE_URL}/${img}` || "/file.svg"}
              alt={`Carousel image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))
      ) : (
        <div className="w-full text-center text-gray-400 py-8">No images to display</div>
      )}
    </div>
  </div>
  );
}