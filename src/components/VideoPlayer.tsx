import { useRef, useState, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { EnhanceButton } from './EnhanceButton'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEnhanced, setIsEnhanced] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let lastUpdate = 0
    const onTimeUpdate = () => {
      if (video.currentTime - lastUpdate >= 0.1 || video.currentTime < lastUpdate) {
        lastUpdate = video.currentTime
        setCurrentTime(video.currentTime)
      }
    }
    const onDurationChange = () => setDuration(video.duration)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const vol = parseFloat(e.target.value)
    video.volume = vol
    setVolume(vol)
    setMuted(vol === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container')
    if (!videoContainer) return

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div id="video-container" className="player-glass relative flex flex-col items-center justify-center gap-6">
      <video
        ref={videoRef}
        className={`rounded-lg shadow-lg transition-all duration-300 w-full max-w-4xl h-auto ${
          isEnhanced ? 'filter contrast-125 brightness-110 saturate-125 drop-shadow-lg' : ''
        }`}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
        preload="metadata"
      />

      <div className="controls w-full max-w-4xl flex items-center justify-between">
        <div className="controls-left flex items-center gap-4">
          <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="icon-button">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="icon-button">
            {muted || volume === 0 ? <VolumeX size={24} /> : <Volume size={24} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />

          <span className="text-sm select-none">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} /{' '}
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="controls-right flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-64"
          />

          <button onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} className="icon-button">
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      </div>

      <EnhanceButton
        videoRef={videoRef}
        onEnhanced={() => {
          setIsEnhanced(true)
        }}
      />
    </div>
  )
}