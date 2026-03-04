import * as React from 'react'
import type { ComponentDefinition } from '../types'

export interface VideoProps {
  src?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  aspectRatio?: '16:9' | '4:3' | '1:1'
  style?: React.CSSProperties
  className?: string
}

const ASPECT_RATIO_MAP: Record<string, string> = {
  '16:9': '56.25%',
  '4:3': '75%',
  '1:1': '100%',
}

function isYouTubeUrl(src: string): boolean {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/)/.test(src)
}

function isVimeoUrl(src: string): boolean {
  return /vimeo\.com\//.test(src)
}

function getYouTubeEmbedUrl(src: string): string {
  const match = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)
  const id = match?.[1] ?? ''
  return `https://www.youtube.com/embed/${id}`
}

function getVimeoEmbedUrl(src: string): string {
  const match = src.match(/vimeo\.com\/(\d+)/)
  const id = match?.[1] ?? ''
  return `https://player.vimeo.com/video/${id}`
}

export const VideoComponent: React.FC<VideoProps> = ({
  src = '',
  autoplay = false,
  controls = true,
  loop = false,
  aspectRatio = '16:9',
  style,
  className,
}) => {
  const paddingTop = ASPECT_RATIO_MAP[aspectRatio] ?? '56.25%'

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop,
    ...style,
  }

  const innerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  if (!src) {
    return (
      <div
        className={className}
        style={{
          ...wrapperStyle,
          background: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>No video source</span>
      </div>
    )
  }

  if (isYouTubeUrl(src)) {
    const embedUrl =
      getYouTubeEmbedUrl(src) +
      `?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`
    return (
      <div className={className} style={wrapperStyle}>
        <iframe
          src={embedUrl}
          style={innerStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>
    )
  }

  if (isVimeoUrl(src)) {
    const embedUrl = getVimeoEmbedUrl(src) + `?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}`
    return (
      <div className={className} style={wrapperStyle}>
        <iframe
          src={embedUrl}
          style={innerStyle}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo video"
        />
      </div>
    )
  }

  return (
    <div className={className} style={wrapperStyle}>
      <video src={src} autoPlay={autoplay} controls={controls} loop={loop} style={innerStyle} />
    </div>
  )
}

export const videoDefinition: ComponentDefinition = {
  type: 'Video',
  displayName: 'Video',
  category: 'Media',
  icon: 'video',
  defaultProps: {
    src: '',
    autoplay: false,
    controls: true,
    loop: false,
    aspectRatio: '16:9',
  },
  propSchema: {
    src: { type: 'url' },
    autoplay: { type: 'boolean' },
    controls: { type: 'boolean' },
    loop: { type: 'boolean' },
    aspectRatio: {
      type: 'select',
      options: [
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
      ],
    },
  },
  acceptsChildren: false,
}
