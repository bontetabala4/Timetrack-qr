import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff } from 'lucide-react'

type QrCameraScannerProps = {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (message: string) => void
}

export default function QrCameraScanner({
  onScanSuccess,
  onScanError,
}: QrCameraScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const readerIdRef = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`)
  const [isStarting, setIsStarting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const startScanner = async () => {
    if (isRunning || isStarting) return

    try {
      setIsStarting(true)

      const scanner = new Html5Qrcode(readerIdRef.current)
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          await stopScanner()
          onScanSuccess(decodedText)
        },
        () => {
          // On ignore les erreurs de frame pour éviter le bruit
        }
      )

      setIsRunning(true)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Impossible de démarrer la caméra'

      onScanError?.(message)
    } finally {
      setIsStarting(false)
    }
  }

  const stopScanner = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop()
        await scannerRef.current.clear()
      }
    } catch {
      // ignore
    } finally {
      scannerRef.current = null
      setIsRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      void stopScanner()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div
        id={readerIdRef.current}
        className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => void startScanner()}
          disabled={isRunning || isStarting}
          className="flex-1 rounded-2xl bg-blue-600 px-4 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <Camera size={18} />
            {isStarting ? 'Ouverture caméra...' : isRunning ? 'Caméra active' : 'Ouvrir la caméra'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => void stopScanner()}
          disabled={!isRunning}
          className="rounded-2xl bg-slate-800 px-4 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <CameraOff size={18} />
            Fermer
          </span>
        </button>
      </div>
    </div>
  )
}