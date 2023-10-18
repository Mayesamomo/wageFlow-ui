

const InvoiceChart = () => {
  return (
    <div className="bg-white p-4 rounded-md">
    <h2 className="text-gray-500 text-lg font-semibold pb-1">Invoices</h2>
    <div className="my-1"></div> {/* Espacio de separación */}
    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> {/* Línea con gradiente */}
    <div className="chart-container" style={{ position: 'relative', height: '150px', width: '100%' }}>
      {/* The canvas for the chart */}
      <canvas id="commercesChart"></canvas>
    </div>
  </div>
  )
}

export default InvoiceChart