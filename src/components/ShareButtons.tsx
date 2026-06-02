// Botons per compartir l'app a les xarxes socials.

import { useState } from 'react'

const SHARE_TEXT =
  "Practica l'examen de mates de primària amb variants automàtiques i correcció a l'instant! 🧮"

// URL canònica per compartir (en producció). Si s'obre en local, fa servir l'origen actual.
function shareUrl(): string {
  if (typeof window !== 'undefined') {
    const { origin } = window.location
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin + '/'
    }
  }
  return 'https://olaya-homework.vercel.app/'
}

interface NetBtn {
  key: string
  label: string
  href: (url: string, text: string) => string
  color: string
  icon: JSX.Element
}

const NETWORKS: NetBtn[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    color: '#25d366',
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9 1-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
    ),
  },
  {
    key: 'telegram',
    label: 'Telegram',
    color: '#0088cc',
    href: (u, t) =>
      `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    icon: (
      <path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6.4 13.3l-4.8-1.5C.5 11.5.5 10.8 1.9 10.3l18-6.9c.9-.3 1.7.2 1.4 1Z" />
    ),
  },
  {
    key: 'twitter',
    label: 'X',
    color: '#111',
    href: (u, t) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    icon: (
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21H2.5l7-8L2 3h6.2l4.2 5.6L17.5 3Zm-1 16h1.6L7.6 4.7H5.9L16.5 19Z" />
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    color: '#1877f2',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icon: (
      <path d="M13.5 21v-8h2.6l.4-3h-3V8.1c0-.9.3-1.5 1.6-1.5h1.5V4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V10H8v3h2.7v8h2.8Z" />
    ),
  },
]

export function ShareButtons() {
  const [copied, setCopied] = useState(false)
  const url = shareUrl()
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  function open(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "Practica l'examen de mates", text: SHARE_TEXT, url })
    } catch {
      /* l'usuari ha cancel·lat */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share">
      <span className="share-label">Comparteix:</span>
      <div className="share-row">
        {canNativeShare && (
          <button
            type="button"
            className="share-btn share-native"
            onClick={nativeShare}
            aria-label="Comparteix"
            title="Comparteix"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18 16a3 3 0 0 0-2.3 1.1l-6.1-3a3 3 0 0 0 0-2.2l6.1-3A3 3 0 1 0 15 6c0 .3 0 .6.1.9l-6.1 3a3 3 0 1 0 0 4.2l6.1 3c-.1.3-.1.6-.1.9a3 3 0 1 0 3-3Z" />
            </svg>
          </button>
        )}
        {NETWORKS.map((n) => (
          <button
            type="button"
            key={n.key}
            className="share-btn"
            style={{ background: n.color }}
            onClick={() => open(n.href(url, SHARE_TEXT))}
            aria-label={`Comparteix a ${n.label}`}
            title={n.label}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              {n.icon}
            </svg>
          </button>
        ))}
        <button
          type="button"
          className={`share-btn share-copy ${copied ? 'is-copied' : ''}`}
          onClick={copyLink}
          aria-label="Copia l'enllaç"
          title={copied ? 'Enllaç copiat!' : "Copia l'enllaç"}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3.9 12a3 3 0 0 1 3-3h4V7h-4a5 5 0 0 0 0 10h4v-2h-4a3 3 0 0 1-3-3Zm5 1h6v-2h-6v2Zm8.1-6h-4v2h4a3 3 0 0 1 0 6h-4v2h4a5 5 0 0 0 0-10Z" />
            </svg>
          )}
        </button>
      </div>
      {copied && <span className="share-copied-text">Enllaç copiat! ✅</span>}
    </div>
  )
}
