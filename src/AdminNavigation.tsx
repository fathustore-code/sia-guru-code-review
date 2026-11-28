type AdminMenu =
  | 'summary'
  | 'admin-history'
  | 'teachers'
  | 'leave-approval'
  | 'qr-settings'
  | 'teacher-schedules'
  | 'schedule-documents'
  | 'teacher-replacements'
  | 'honor-settings'
  | 'honor-management'
  | 'kaldik'

type Props = {
  onSelect: (menu: AdminMenu) => void
}

const menus: {
  id: AdminMenu
  title: string
  description: string
  symbol: string
}[] = [
  { id: 'summary', title: 'Ringkasan Kehadiran', description: 'Pantau rekap kehadiran guru', symbol: '▥' },
  { id: 'admin-history', title: 'Riwayat Absensi', description: 'Lihat riwayat absensi seluruh guru', symbol: '◷' },
  { id: 'teachers', title: 'Pengelolaan Guru', description: 'Daftarkan dan kelola akun guru', symbol: '♙' },
  { id: 'leave-approval', title: 'Pengajuan Izin', description: 'Periksa dan setujui pengajuan izin', symbol: '✓' },
  { id: 'qr-settings', title: 'Pengaturan QR Absensi', description: 'Kelola QR absensi sekolah', symbol: '▦' },
  { id: 'teacher-schedules', title: 'Jadwal Mengajar', description: 'Kelola jadwal mengajar guru', symbol: '▤' },
  { id: 'schedule-documents', title: 'Dokumen Jadwal', description: 'Unggah dan kelola dokumen jadwal mengajar', symbol: '▧' },
  { id: 'teacher-replacements', title: 'Guru Pengganti', description: 'Kelola penugasan guru pengganti', symbol: '⇄' },
  { id: 'honor-settings', title: 'Pengaturan Honor', description: 'Atur tarif honor dan riwayat perubahannya', symbol: '◇' },
  { id: 'honor-management', title: 'Manajemen Honor', description: 'Hitung, periksa, dan kelola rekap honor guru', symbol: '▱' },
  { id: 'kaldik', title: 'Kalender Pendidikan', description: 'Lihat dan kelola kalender pendidikan serta hari libur madrasah', symbol: '▦' },
]

export default function AdminNavigation({ onSelect }: Props) {
  return (
    <section style={{ marginTop: 25 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: '#174B35', fontSize: 20, margin: '0 0 5px' }}>
          Menu Administrasi
        </h2>
        <p style={{ color: '#718078', fontSize: 13, margin: 0 }}>
          Pilih layanan yang ingin dibuka.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
        gap: 12,
      }}>
        {menus.map((menu) => (
          <button key={menu.id} type="button" onClick={() => onSelect(menu.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              minHeight: 88, padding: '15px 14px', textAlign: 'left',
              background: '#ffffff', border: '1px solid #E3EBE5',
              borderRadius: 15, cursor: 'pointer', color: '#26352D',
              boxShadow: '0 3px 10px rgba(25, 65, 42, 0.035)',
              width: '100%', boxSizing: 'border-box',
            }}>
            <span aria-hidden="true" style={{
              width: 38, height: 38, flexShrink: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 11, background: '#EAF3ED',
              color: '#087447', fontSize: 21, fontWeight: 700,
            }}>
              {menu.symbol}
            </span>
            <span style={{ display: 'block', minWidth: 0, paddingTop: 1 }}>
              <strong style={{ display: 'block', marginBottom: 5, fontSize: 13, lineHeight: 1.35, color: '#174B35' }}>
                {menu.title}
              </strong>
              <span style={{ display: 'block', color: '#718078', fontSize: 12, lineHeight: 1.45 }}>
                {menu.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
