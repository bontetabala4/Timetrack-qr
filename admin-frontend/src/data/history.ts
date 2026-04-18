export type HistoryItem = {
  id: number
  date: string
  checkIn: string
  checkOut: string
  status: 'Présent' | 'Retard' | 'Absent'
}

export const historyData: HistoryItem[] = [
  {
    id: 1,
    date: '07 Avril 2026',
    checkIn: '08:03',
    checkOut: '17:04',
    status: 'Présent',
  },
  {
    id: 2,
    date: '06 Avril 2026',
    checkIn: '08:11',
    checkOut: '17:00',
    status: 'Présent',
  },
  {
    id: 3,
    date: '05 Avril 2026',
    checkIn: '08:37',
    checkOut: '17:09',
    status: 'Retard',
  },
  {
    id: 4,
    date: '04 Avril 2026',
    checkIn: '--',
    checkOut: '--',
    status: 'Absent',
  },
]