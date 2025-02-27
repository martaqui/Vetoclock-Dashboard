import { useState, useEffect } from 'react'
import '../../index.css'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { COLORS } from '@/constants/chart.constant'

interface DataPoint {
    x: string
    y: number
}

interface Dataset {
    label: string
    data: DataPoint[]
}

interface FetchedData {
    datasets: Dataset[]
}

const VentasUltimosDosMeses = () => {
    const [chartData, setChartData] = useState<{
        series: { name: string; data: number[]; color: string }[]
        categories: string[]
    }>({
        series: [],
        categories: [],
    })

    useEffect(() => {
        fetch('/data/ingresos_ultimos_dos_meses.json')
            .then((response) => response.json())
            .then((data: FetchedData) => {
                const labels = data.datasets[0].data.map((item) => item.x)
                const series = data.datasets.map((dataset, index) => ({
                    name: dataset.label,
                    data: dataset.data.map((item) => item.y),
                    color: COLORS[index],
                }))
                setChartData({ series, categories: labels })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])
    const options: ApexOptions = {
        chart: {
            type: 'line',
            zoom: { enabled: false },
        },
        colors: [COLORS[0], COLORS[1]],
        dataLabels: { enabled: false },
        stroke: {
            width: [3, 3],
            curve: 'straight',
        },
        markers: {
            size: 4, // Tamaño de los puntos en la gráfica
        },
        legend: {
            position: 'top',
            itemMargin: {
                horizontal: 30, // Espacio entre el punto y el texto
                vertical: 50,
            },
        },
        xaxis: {
            categories: chartData.categories,
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} unidades`,
            },
            marker: {
                show: true,
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
