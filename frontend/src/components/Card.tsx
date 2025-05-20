import { useState } from 'react';
import { ShareIcon } from '@/icons/ShareIcon';
import { TwitterIcon } from '@/icons/TwitterIcon';
import { ClipboardIcon } from '@/icons/ClipboardIcon';


interface CardProps {
  title: string;
  link: string;
  type: 'youtube' | 'twitter';
}

export function Card({ title, link, type }: CardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

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

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: `Check this out: ${title}`,
        url: link,
      });
    } catch (err) {
      console.log('Native sharing cancelled', err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
      setShowShareOptions(false);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  const shareToTwitter = () => {
    const tweetText = `${title} ${link}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowShareOptions(false);
  };

 

  const handleShareClick = () => {
    if (navigator.share) {
      handleNativeShare();
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72 relative">
      {/* Header with title and share button */}
      <div className="flex justify-between">
        <div className="flex items-center text-md font-medium truncate max-w-[180px]">
          {title}
        </div>
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Share content"
          >
            <ShareIcon />
          </button>

          {/* Share options dropdown */}
          {showShareOptions && (
            <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg p-2 z-10 w-48 border border-gray-200">
              <button
                onClick={copyToClipboard}
                className="flex items-center w-full p-2 hover:bg-gray-100 rounded"
              >
                <ClipboardIcon />
                Copy Link
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center w-full p-2 hover:bg-gray-100 rounded"
              >
                <TwitterIcon />
                Share to Twitter
              </button>
              <button
                onClick={shareToFacebook}
                className="flex items-center w-full p-2 hover:bg-gray-100 rounded"
              >
                <FacebookIcon className="w-4 h-4 mr-2 text-blue-600" />
                Share to Facebook
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {type === 'youtube' && videoId && (
          <>
            {!showVideo ? (
              <div className="relative">
                <img
                  src={thumbnail}
                  alt="YouTube thumbnail"
                  className="w-full h-40 cursor-pointer rounded object-cover"
                  onClick={() => setShowVideo(true)}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.currentTarget.src = 'https://via.placeholder.com/320x180';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.7c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L10.6 10l-5.7 5.7c-.4.4-.4 1 0 1.4.2.2.4.3.7.3.3 0 .5-.1.7-.3l6-6c.4-.4.4-1 0-1.4l-6-6z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-40"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </>
        )}

        {type === 'twitter' && (
          <blockquote className="twitter-tweet">
            <a href={link.replace('x.com', 'twitter.com')}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
}
