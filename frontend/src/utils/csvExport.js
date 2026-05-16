export const exportToCSV = (data, filename = 'complaints_export.csv') => {
  if (!data || !data.length) return
  
  const headers = ['Complaint ID', 'Title', 'Category', 'Status', 'Location', 'User', 'Date']
  const rows = data.map(c => [
    c.complaintId || c._id,
    `"${c.title.replace(/"/g, '""')}"`,
    c.category,
    c.status,
    `"${c.location.replace(/"/g, '""')}"`,
    c.userEmail,
    c.createdAt
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
