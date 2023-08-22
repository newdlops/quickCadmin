import React from 'react'

export default function DashboardLayout({
  children, // will be a page or nested layout
  testb,
}: {
  children: React.ReactNode
  testb: React.ReactNode
}) {
  return (
    <section>
      <div>layout</div>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
      {children}
      {testb}
    </section>
  )
}