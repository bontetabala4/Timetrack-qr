import { motion, AnimatePresence } from 'motion/react'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import UserLayout from '../../components/layout/UserLayout'
import QrCameraScanner from '../../components/qr/QrCameraScanner'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../hooks/useAuth'
import { fetchMyToday, scanAttendance } from '../../services/auth'

type ScanState = 'idle' | 'loading' | 'success' | 'error'

export default function Scan() {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const { showToast } = useToast()
  const { token, user } = useAuth()

  const [scanState, setScanState] = useState<ScanState>('idle')
  const [lastScanMessage, setLastScanMessage] = useState('')
  const [scannedAt, setScannedAt] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  )
  const [todayStatus, setTodayStatus] = useState<'present' | 'late' | 'absent' | 'none'>('none')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadToday = async () => {
      if (!token) return

      try {
        const { attendance } = await fetchMyToday(token)

        if (!attendance) {
          setTodayStatus('none')
          return
        }

        setTodayStatus(attendance.status)

        if (attendance.checkInTime) {
          const time = new Date(attendance.checkInTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })
          setScannedAt(time)
          setLastScanMessage(`Présence déjà enregistrée à ${time}`)
          setScanState('success')
        }
      } catch {
        showToast('Impossible de charger la présence du jour', 'error')
      }
    }

    void loadToday()
  }, [token, showToast])

  const handleDecodedScan = async (decodedText: string) => {
    if (!token) return

    try {
      setScanState('loading')
      setLastScanMessage('Validation du QR code...')

      const data = await scanAttendance(token, decodedText)
      const attendance = data.attendance

      const time = attendance?.checkInTime
        ? new Date(attendance.checkInTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null

      setScanState('success')
      setTodayStatus(attendance?.status ?? 'present')
      setScannedAt(time)
      setLastScanMessage(data.message || 'Présence enregistrée avec succès')
      showToast('Pointage enregistré avec succès', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Échec du scan'
      setScanState('error')
      setLastScanMessage(message)
      showToast(message, 'error')
    }
  }

  const handleScannerError = (message: string) => {
    setScanState('error')
    setLastScanMessage(message)
    showToast(message, 'error')
  }

  const handleReset = () => {
    setScanState('idle')
    setLastScanMessage('')
  }

  const isOnTime = todayStatus !== 'late'

  return (
    <UserLayout>
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Bonjour {user?.fullName || 'Utilisateur'},
            </p>
            <p className="mt-2 text-base text-slate-300 sm:text-lg">
              Prêt à pointer ?
            </p>
          </div>

          <p className="text-sm capitalize text-slate-300 md:pt-2">{currentDate}</p>
        </div>
      </motion.header>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Scanner le QR Code</h1>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Ouvre la caméra puis vise le QR code affiché à l’entrée
            </p>
          </div>

          <div className="mt-8">
            <QrCameraScanner
              onScanSuccess={(decodedText) => void handleDecodedScan(decodedText)}
              onScanError={handleScannerError}
            />
          </div>

          <AnimatePresence>
            {scanState === 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                className="mt-5 rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-4 text-sm text-slate-300"
              >
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" />
                  Validation du scan...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {lastScanMessage && scanState !== 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                className={`mt-5 rounded-2xl border px-4 py-4 text-sm ${
                  scanState === 'success'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    : scanState === 'error'
                    ? 'border-red-500/20 bg-red-500/10 text-red-300'
                    : 'border-slate-700 bg-slate-800/60 text-slate-300'
                }`}
              >
                {lastScanMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {scanState === 'error' && (
            <button
              onClick={handleReset}
              className="mt-4 w-full rounded-2xl bg-slate-800 px-5 py-4 text-base font-medium text-white transition hover:bg-slate-700"
            >
              Réinitialiser
            </button>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-5 text-sm sm:flex-row sm:flex-wrap sm:justify-center">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock3 size={16} />
              <span>Heure actuelle : {currentTime}</span>
            </div>

            <span className="hidden text-slate-500 sm:inline">|</span>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className={isOnTime ? 'text-emerald-400' : 'text-red-400'}
              />
              <span className={isOnTime ? 'text-emerald-400' : 'text-red-400'}>
                {todayStatus === 'none'
                  ? 'Pas encore pointé'
                  : isOnTime
                  ? "Vous êtes à l'heure"
                  : 'Vous êtes en retard'}
              </span>
            </div>

            {scannedAt && (
              <>
                <span className="hidden text-slate-500 sm:inline">|</span>
                <div className="text-slate-300">Dernier scan : {scannedAt}</div>
              </>
            )}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6"
        >
          <h2 className="text-xl font-semibold text-white">Informations du jour</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">Date</p>
              <p className="mt-1 font-semibold capitalize text-white">{currentDate}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">Heure actuelle</p>
              <p className="mt-1 font-semibold text-white">{currentTime}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">État</p>
              <p className={`mt-1 font-semibold ${isOnTime ? 'text-emerald-400' : 'text-red-400'}`}>
                {todayStatus === 'none' ? 'Pas encore pointé' : isOnTime ? 'À l’heure' : 'En retard'}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </UserLayout>
  )
}