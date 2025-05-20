import { useState } from 'react';
import { ShareIcon } from '../icons/ShareIcon';

interface CardProps {
  title: string;
  link: string;
  type: 'twitter' | 'youtube';
}

export function Card({ title, link, type }: CardProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Improved YouTube ID extraction to support both youtu.be and youtube.com URLs
  const getYoutubeId = (url: string): string | null => {
    
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  const videoId = getYoutubeId(link);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : '';

  return (
    <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center text-md">
          <div className="text-gray-500 pr-2">{/* Optional: Icon */}</div>
          {title}
        </div>
        <div className="text-gray-500">
          <ShareIcon />
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {/* YouTube */}
        {type === 'youtube' && videoId && (
          <>
            {!showVideo ? (
              <img
                src={thumbnail}
                alt="YouTube thumbnail"
                className="w-full cursor-pointer rounded"
                onClick={() => setShowVideo(true)}
              />
            ) : (
              <iframe
                className="w-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </>
        )}

        {/* Twitter */}
        {type === 'twitter' && (
          <blockquote className="twitter-tweet">
            <a href={link.replace('x.com', 'twitter.com')}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
}
