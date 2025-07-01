import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface EnhanceButtonProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onEnhanced: (url: string) => void
}

// Only enhance the current paused frame for instant, smooth experience
export function EnhanceButton({ videoRef, onEnhanced }: EnhanceButtonProps) {
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleEnhance = async () => {
    const video = videoRef.current
    if (!video || !video.paused) {
      alert('Pause the video at the frame you want to enhance.')
      return
    }
    setLoading(true)
    const width = video.videoWidth
    const height = video.videoHeight
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, width, height)
    // Apply a CSS filter for demo (sharpen is not native, so use contrast/brightness)
    ctx.filter = 'contrast(1.2) brightness(1.1)'
    ctx.drawImage(canvas, 0, 0, width, height)
    ctx.filter = 'none'
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        onEnhanced(url)
      }
      setLoading(false)
    }, 'image/webp')
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={handleEnhance}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50"
      >
        <Sparkles size={18} />
        {loading ? 'Enhancing...' : 'Enhance Paused Frame'}
      </button>
      <div className="text-xs text-gray-400 mt-1">Pause the video, then click to enhance the current frame.</div>
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
