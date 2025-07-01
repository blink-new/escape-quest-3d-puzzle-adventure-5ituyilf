import { useRef, useState, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume,
  VolumeX,
  Maximize2,
  Minimize2,
  Upload,
  Sparkles,
} from 'lucide-react'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoSrc, setVideoSrc] = useState<string>('')
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

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onLoadedMetadata = () => setDuration(video.duration)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || !videoSrc) return
    
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
    const container = document.getElementById('video-container')
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleEnhancement = () => {
    setIsEnhanced(!isEnhanced)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div 
      id="video-container" 
      className="relative w-full max-w-5xl mx-auto bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Video display area */}
      <div className="relative aspect-video bg-black rounded-t-3xl overflow-hidden">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className={`w-full h-full object-contain transition-all duration-300 ${
              isEnhanced 
                ? 'filter contrast-125 brightness-110 saturate-125 hue-rotate-15' 
                : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
            <Upload size={64} className="mb-4 opacity-40" />
            <p className="text-xl font-medium mb-2">Upload a video to get started</p>
            <p className="text-sm opacity-60">Click the upload button below</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-white/5 backdrop-blur-xl">
        {/* Progress bar */}
        <div className="mb-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={!videoSrc}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-blue-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={triggerUpload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                       text-white rounded-xl font-medium transition-all duration-200 
                       shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Upload size={20} />
              Upload
            </button>

            <button
              onClick={togglePlay}
              disabled={!videoSrc}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-105"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={toggleMute}
              disabled={!videoSrc}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {muted || volume === 0 ? <VolumeX size={20} /> : <Volume size={20} />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              disabled={!videoSrc}
              className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                       [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <span className="text-white/80 text-sm font-mono min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleEnhancement}
              disabled={!videoSrc}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-105 ${
                isEnhanced 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles size={18} />
              {isEnhanced ? 'Enhanced' : 'Enhance'}
            </button>

            <button
              onClick={toggleFullscreen}
              disabled={!videoSrc}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-105"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}