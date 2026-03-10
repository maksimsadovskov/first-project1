import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { closeTrailerModal } from '../../store/slices/modalSlice';
import './TrailerModal.css';
import closeIcon from '../../assets/icons/close-button.svg';
import pauseIcon from '../../assets/icons/player-button.svg';
import playIcon from '../../assets/icons/player-start-button.svg';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  trailerTitle: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ 
  isOpen, 
  onClose, 
  trailerUrl, 
  trailerTitle 
}) => {
  const dispatch = useAppDispatch();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !trailerUrl) return;

    const videoId = trailerUrl.match(/embed\/([^?]+)/)?.[1];
    if (!videoId) return;

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
    }

    const playerId = `yt-player-${Date.now()}`;
    containerRef.current.innerHTML = `<div id="${playerId}"></div>`;

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0, // Не показывать похожие видео
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3, // Отключить аннотации
        disablekb: 1, // Отключить клавиатурные контролы
      },
      events: {
        onReady: () => {
          setPlayerReady(true);
        },
        onStateChange: (event: any) => {
          if (event.data === 1) {
            setIsPaused(false);
            setIsLoading(false); // Скрываем loader когда видео играет
          }
          if (event.data === 2) setIsPaused(true);
        },
      },
    });
  }, [trailerUrl]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
      setIsPaused(false);
      setPlayerReady(false);
      setIsLoading(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    setIsPaused(false);
    setIsLoading(true);

    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initPlayer]);

  const handleClose = () => {
    dispatch(closeTrailerModal());
    onClose();
  };

  const handleVideoClick = () => {
    if (!playerRef.current || !playerReady) return;

    try {
      const state = playerRef.current.getPlayerState();
      if (state === 1) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="trailer-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="trailer-modal">
        <button className="trailer-modal__close-btn" onClick={handleClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        
        <div className="trailer-modal__video-wrapper">
          <div ref={containerRef} className="trailer-modal__video" />
          
          {isLoading && (
            <div className="trailer-modal__loader">
              <div className="trailer-modal__spinner"></div>
              <p>Загрузка видео...</p>
            </div>
          )}
          
          <div 
            className="trailer-modal__click-overlay"
            onClick={handleVideoClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          />
          
          {isPaused && !isLoading && (
            <>
              {/* Блок полутона в самом низу */}
              <div className="trailer-modal__title-bg trailer-modal__title-bg--horizontal" />
              
              <div className="trailer-modal__controls">
                <img 
                  src={isHovering ? playIcon : pauseIcon} 
                  alt="Pause" 
                  className="trailer-modal__control-icon"
                />
              </div>
              
              {/* Текст названия с отступами */}
              <div className="trailer-modal__title trailer-modal__title--horizontal">
                {trailerTitle}
              </div>
            </>
          )}
        </div>
        
        {isPaused && !isLoading && (
          <div className="trailer-modal__title trailer-modal__title--vertical">
            {trailerTitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
