interface ThumbnailProps {
  imageUrl?: string;
  name: string;
}

const Thumbnail = ({ imageUrl, name }: ThumbnailProps) => {
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-100 flex items-center justify-center flex-shrink-0">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <i className="pi pi-image text-sm text-surface-300" />
      )}
    </div>
  );
};

export default Thumbnail;
