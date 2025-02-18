import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const VentasUltimosDosMeses = () => {
    const [chartData, setChartData] = useState<{
        series: any[]
        categories: string[]
    }>({
        series: [],
        categories: [],
    })

    useEffect(() => {
        fetch('/data/ingresos_ultimos_dos_meses.json')
            .then((response) => response.json())
            .then((data) => {
                const labels = data.datasets[0].data.map((item: any) => item.x)
                const series = data.datasets.map(
                    (dataset: any, index: number) => ({
                        name: dataset.label,
                        data: dataset.data.map((item: any) => item.y),
                        color: COLORS[index], // Usa colores predefinidos
                    }),
                )

                setChartData({ series, categories: labels })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])

    const options = {
        chart: {
            type: 'line',
            zoom: { enabled: false },
        },
        colors: [COLORS[0], COLORS[1]], // Solo dos colores
        dataLabels: { enabled: false },
        stroke: {
            width: [3, 3], // Mismo grosor para ambas líneas
            curve: 'straight',
            dashArray: [0, 0], // Sin líneas punteadas
        },
        markers: { size: 4 },
        legend: { position: 'top' },
        xaxis: { categories: chartData.categories },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} unidades`,
            },
        },
        grid: { borderColor: '#f1f1f1' },
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">
                Comparación de Ingresos (Últimos 2 meses)
            </h2>
            <Chart options={options} series={chartData.series} height={300} />
        </div>
    )
}

export default VentasUltimosDosMeses
