import Link from 'next/link'
import { ReactNode } from 'react'
import Providers from '@/components/Providers'

import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Providers>
          <div className="flex h-screen bg-slate-50">
          {/* Sidebar - FIX REFERENCE: FIX-20260303-01 - overflow-y-auto para sidebar scrollable */}
          <aside className="w-64 bg-slate-900 text-white hidden md:flex md:flex-col flex-shrink-0">
            <div className="p-6 flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Residente Digital
              </h1>
              <p className="text-xs text-slate-400 mt-1">Administración Médica v0.1</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
              <NavItem href="/dashboard" icon="📊" label="Dashboard" />
              <NavItem href="/workers" icon="👥" label="Trabajadores" />
              <NavItem href="/reception" icon="🏥" label="Piso Clínico" />
              <NavItem href="/appointments" icon="📅" label="Gestión de Citas" />
              <div className="pt-4 pb-2">
                <p className="text-xs uppercase text-slate-500 font-semibold px-2">Médico</p>
              </div>
              <NavItem href="/events" icon="📁" label="Expedientes Activos" />
              <NavItem href="/validation" icon="✅" label="Validación" />

              <div className="pt-4 pb-2">
                <p className="text-xs uppercase text-slate-500 font-semibold px-2">Administración Clínica</p>
              </div>
              <NavItem href="/branches" icon="🏥" label="Sucursales AMI" />
              <NavItem href="/admin/users" icon="👨‍⚕️" label="Personal AMI" />
              <NavItem href="/admin/clinical-catalog" icon="🔬" label="Catálogo Clínico" />
              <NavItem href="/admin/medical-profiles" icon="📦" label="Perfiles Médicos" />
              {/* LEGACY DEPRECATED (Fase 1): 
                <NavItem href="/admin/services" icon="🩺" label="Catálogo Servicios" />
                <NavItem href="/admin/profiles" icon="📦" label="Baterías (Paquetes)" />
              */}
              <NavItem href="/admin/audit" icon="📋" label="Bitácora de Auditoría" />
              <NavItem href="/companies" icon="🏢" label="Empresas Cliente" />

              <div className="pt-4 pb-2">
                <p className="text-xs uppercase text-blue-400 font-semibold px-2">B2B Cliente</p>
              </div>
              <NavItem href="/portal" icon="🌐" label="Portal de Empresas" />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
              <h2 className="text-lg font-medium text-slate-700">Panel de Control</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Dr. Usuario Demo</span>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
              </div>
            </header>
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
              <div className="flex gap-2 overflow-x-auto">
                <MobileNavItem href="/appointments" icon="📅" label="Citas" />
                <MobileNavItem href="/reception" icon="🏥" label="Piso" />
                <MobileNavItem href="/events" icon="📁" label="Expedientes" />
                <MobileNavItem href="/workers" icon="👥" label="Trabajadores" />
              </div>
            </div>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </Providers>
      </body>
    </html>
  )
}

function NavItem({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

function MobileNavItem({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
 
