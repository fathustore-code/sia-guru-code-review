
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './services/supabase'
import QRManager from './QRManager'
import QRScanner from './QRScanner'
import AttendanceHistory from './AttendanceHistory'
import AttendanceSummary from './AttendanceSummary'
import TeacherRegistration from './TeacherRegistration'
import TeacherNavigation from './TeacherNavigation'
import AdminNavigation from './AdminNavigation'
import TeacherScheduleManagement from './TeacherScheduleManagement'
import TeacherScheduleView from './TeacherScheduleView'
import TeachingScheduleDocuments from './TeachingScheduleDocuments'
import LeaveRequest from './LeaveRequest'
import LeaveApproval from './LeaveApproval'
import TeacherReplacementManagement from './TeacherReplacementManagement'
import HonorRateManagement from './HonorRateManagement'
import HonorManagement from './HonorManagement'
import Kaldik from './Kaldik'


type TeacherProfile = {
full_name: string
role: string
is_active: boolean
email: string
phone: string | null
employee_number: string | null
}

function App() {
const [session, setSession] = useState<Session | null>(null)
const [profile, setProfile] = useState<TeacherProfile | null>(null)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [message, setMessage] = useState('')
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [activeMenu, setActiveMenu] = useState<
| 'home'
| 'attendance'
| 'history'
| 'leave'
| 'account'
| 'summary'
| 'admin-history'
| 'teachers'
| 'leave-approval'
| 'qr-settings'
| 'teacher-schedules'
| 'my-schedule'

| 'schedule-documents'
| 'teacher-replacements'
| 'honor-settings'
| 'honor-management'
| 'kaldik'
>('home')


useEffect(() => {
supabase.auth.getSession().then(({ data }) => {
setSession(data.session)
setLoading(false)
})

const { data: listener } = supabase.auth.onAuthStateChange(
(_event, newSession) => {
setSession(newSession)
}
)

return () => listener.subscription.unsubscribe()
}, [])

useEffect(() => {
async function loadProfile() {
if (!session) {
setProfile(null)
return
}

const { data, error } = await supabase
.from('users')
.select('full_name, role, is_active')
.eq('id', session.user.id)
.single()

if (error) {
setMessage('Gagal mengambil profil: ' + error.message)
setProfile(null)
return
}

if (!data.is_active) {
setMessage('Akun Anda tidak aktif. Hubungi admin sekolah.')
await supabase.auth.signOut()
return
}

const { data: teacherData } = await supabase
.from('teachers')
.select('employee_number, phone')
.eq('id', session.user.id)
.single();                                                                                                    setProfile({
...data,
email: session.user.email ?? '',
phone: teacherData?.phone ?? null,
employee_number: teacherData?.employee_number ?? null,
})

setMessage('')

}

loadProfile()
}, [session])

async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault()
setSubmitting(true)
setMessage('')

const { error } = await supabase.auth.signInWithPassword({
email,
password,
})

setSubmitting(false)

if (error) {
setMessage('Login gagal: ' + error.message)
}
}

async function handleLogout() {
const { error } = await supabase.auth.signOut()

if (error) {
setMessage('Gagal keluar: ' + error.message)
} else {
setProfile(null)
setMessage('')
setPassword('')
}
}

if (loading) {
return <main style={{ padding: 30, fontFamily: 'Arial' }}>
Memuat SIA GURU...
</main>
}

if (session && profile) {
return (
<main style={{
minHeight: '100vh',
background: '#F5F8F5',
padding: '20px 14px 32px',
fontFamily: 'Arial, sans-serif',
boxSizing: 'border-box'
}}>
<section style={{
maxWidth: 620,
margin: '0 auto'
}}>
<header style={{
background: 'linear-gradient(135deg, #075D39 0%, #087447 62%, #0B8050 100%)',
color: 'white',
padding: 20,
borderRadius: 18,
boxShadow: '0 8px 22px rgba(8, 116, 71, 0.16)',
border: '1px solid rgba(201, 161, 59, 0.55)'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
<div style={{
width: 76, height: 76, flexShrink: 0, background: '#ffffff',
borderRadius: 14, padding: 5, boxSizing: 'border-box',
display: 'flex', alignItems: 'center', justifyContent: 'center'
}}>
<img src="/logo-riyadhul-ilmi.png" alt="Logo Madrasah Diniyyah Riyadhul Ilmi"
style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
</div>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.1, color: '#F3DFA8', marginBottom: 5 }}>
MADRASAH DINIYYAH
</div>
<h1 style={{ fontSize: 25, lineHeight: 1.1, margin: '0 0 5px', color: '#ffffff' }}>SIA GURU</h1>
<div style={{ fontSize: 12, fontWeight: 600, color: '#F3DFA8' }}>
RIYADHUL ILMI · SURAKARTA
</div>
</div>
</div>
<div style={{ height: 1, background: 'rgba(255,255,255,0.22)', margin: '16px 0 12px' }} />
<p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Selamat datang, {profile.full_name}</p>
<p style={{ margin: '4px 0 0', fontSize: 12, color: '#E2F1E8' }}>Sistem Informasi Absensi Guru</p>
</header>
{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'home' && (
<AdminNavigation onSelect={setActiveMenu} />
)}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu !== 'home' && (
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu Utama
</button>
)}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'summary' && <AttendanceSummary />}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'admin-history' && (
<AttendanceHistory role={profile.role} />
)}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'teachers' && <TeacherRegistration />}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'leave-approval' && <LeaveApproval />}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'qr-settings' && <QRManager />}
{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'teacher-schedules' && (
<TeacherScheduleManagement />
)}
{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'schedule-documents' && (
<TeachingScheduleDocuments role={profile.role} />
)}

{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'teacher-replacements' && (
<TeacherReplacementManagement />
)}


{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'honor-settings' && (
<HonorRateManagement />
)}
{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'honor-management' && (
<HonorManagement />
)}
{(profile.role === 'admin' || profile.role === 'principal') &&
activeMenu === 'kaldik' && (
<Kaldik role={profile.role} />
)}



{profile.role === 'teacher' && activeMenu === 'attendance' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>

<QRScanner />
</>
)}
{profile.role === 'teacher' && activeMenu === 'history' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>

<AttendanceHistory role={profile.role} />
</>
)}

{profile.role === 'teacher' && activeMenu === 'leave' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>

<LeaveRequest />
</>
)}

{profile.role === 'teacher' && activeMenu === 'my-schedule' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>

<TeacherScheduleView />
</>
)}

{profile.role === 'teacher' && activeMenu === 'kaldik' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
borderRadius: 8,
border: '1px solid #d1d5db',
background: '#ffffff',
color: '#374151',
cursor: 'pointer',
fontWeight: 600,
}}
>
← Kembali ke Menu
</button>

<Kaldik role={profile.role} />
</>
)}

{profile.role === 'teacher' && activeMenu === 'schedule-documents' && (
<>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginTop: 20,
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>

<TeachingScheduleDocuments role={profile.role} />
</>
)}
{profile.role === 'teacher' && activeMenu === 'account' && (
<>
<section style={{
background: 'white',
padding: 22,
marginTop: 20,
borderRadius: 14
}}>
<button
type="button"
onClick={() => setActiveMenu('home')}
style={{
marginBottom: 15,
padding: '10px 16px',
background: '#ffffff',
color: '#087447',
border: '1px solid #e2e8f0',
borderRadius: 8,
cursor: 'pointer',
}}
>
← Kembali ke Menu
</button>                                                                                                         <p style={{ color: '#64748b', fontSize: 13 }}>
AKUN GURU
</p>
<h2 style={{
color: '#087447',
fontSize: 22,
margin: '5px 0'
}}>
{profile.full_name}
</h2>
<p style={{ color: '#64748b', margin: '8px 0' }}>
Email: {profile.email || 'Belum diisi'}
</p>

<p style={{ color: '#64748b', margin: '8px 0' }}>
Nomor HP: {profile.phone || 'Belum diisi'}
</p>

<p style={{ color: '#64748b', margin: '8px 0' }}>
Nomor Induk Guru: {profile.employee_number || 'Belum diisi'}
</p>
<p style={{ color: '#64748b', marginBottom: 0 }}>
Peran: {profile.role}
</p>
</section>
</>
)}

{profile.role === 'teacher' && activeMenu === 'home' && (
<TeacherNavigation onSelect={setActiveMenu} />
)}


<button
onClick={handleLogout}
style={{
width: '100%',
marginTop: 25,
padding: 15,
background: '#ffffff',
color: '#A33A32',
border: '1px solid #E7C9C4',
borderRadius: 12,
fontSize: 14,
fontWeight: 700,
cursor: 'pointer',
boxShadow: '0 2px 8px rgba(30, 50, 38, 0.04)'
}}
>
Keluar (Logout)
</button>
</section>
</main>
)
}

return (
<main style={{
minHeight: '100vh',
background: '#F5F8F5',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
padding: 24,
fontFamily: 'Arial, sans-serif',
boxSizing: 'border-box'
}}>
<section style={{
width: '100%',
maxWidth: 420,
background: 'white',
padding: 28,
borderRadius: 18,
boxShadow: '0 12px 34px rgba(22, 65, 42, 0.09)',
border: '1px solid #E5EDE7',
boxSizing: 'border-box'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
<img src="/logo-riyadhul-ilmi.png" alt="Logo Madrasah Diniyyah Riyadhul Ilmi"
style={{ width: 82, height: 82, objectFit: 'contain', background: '#ffffff',
borderRadius: 14, border: '1px solid #E5EDE7', padding: 4, boxSizing: 'border-box' }} />
<div>
<div style={{ color: '#C09A39', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>MADRASAH DINIYYAH</div>
<h1 style={{ color: '#087447', margin: '5px 0', fontSize: 25 }}>SIA GURU</h1>
<div style={{ color: '#087447', fontSize: 11, fontWeight: 700 }}>RIYADHUL ILMI · SURAKARTA</div>
</div>
</div>
<p style={{ color: '#64748b', lineHeight: 1.6, marginTop: 0 }}>
Sistem Informasi Absensi Guru. Silakan masuk menggunakan akun Anda.
</p>

<form onSubmit={handleLogin}>
<label>Email</label>
<input
type="email"
required
value={email}
onChange={e => setEmail(e.target.value)}
placeholder="Masukkan email"
style={{
display: 'block',
width: '100%',
padding: 14,
margin: '9px 0 20px',
border: '1px solid #cbd5e1',
borderRadius: 9,
fontSize: 16,
boxSizing: 'border-box'
}}
/>

<label>Kata Sandi</label>
<input
type="password"
required
value={password}
onChange={e => setPassword(e.target.value)}
placeholder="Masukkan kata sandi"
style={{
display: 'block',
width: '100%',
padding: 14,
margin: '9px 0 22px',
border: '1px solid #cbd5e1',
borderRadius: 9,
fontSize: 16,
boxSizing: 'border-box'
}}
/>

<button
type="submit"
disabled={submitting}
style={{
width: '100%',
padding: 15,
border: 'none',
borderRadius: 9,
background: 'linear-gradient(135deg, #087447, #0B8050)',
color: 'white',
fontSize: 16,
fontWeight: 'bold'
}}
>
{submitting ? 'Memeriksa...' : 'Masuk'}
</button>
</form>

{message && (
<p style={{
marginTop: 18,
padding: 12,
background: '#eff6ff',
color: '#1e40af',
borderRadius: 8,
fontSize: 13,
overflowWrap: 'anywhere'
}}>
{message}
</p>
)}

<p style={{
color: '#94a3b8',
fontSize: 12,
textAlign: 'center',
marginTop: 25
}}>
SIA GURU · Sistem Absensi Sekolah
</p>
</section>
</main>
)
}

export default App

