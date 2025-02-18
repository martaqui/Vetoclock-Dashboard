import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '@/constants/chart.constant'

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

interface ChartDataItem {
    x: string // La etiqueta del eje X
    y: string // El valor en el eje Y
}

interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        borderColor: string
        backgroundColor: string
        borderWidth: number
        tension: number
    }[]
}

const VentasHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/ventas_dataset_anual.json')
            .then((response) => response.json())
            .then((data) => {
                const chartData: ChartData = {
                    labels: data.data.map((item: ChartDataItem) => item.x),
                    datasets: [
                        {
                            label: 'Ventas Anuales',
                            data: data.data.map((item: ChartDataItem) =>
                                parseFloat(item.y),
                            ),
                            borderColor: COLORS[0],
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            tension: 0.3,
                        },
                    ],
                }
                setChartData(chartData)
            })
            .catch((error) => console.error('Error cargando JSON:', error))
    }, [])

    if (!chartData) {
        return <div className="text-center py-4">Cargando...</div>
    }

    // Opciones del gráfico
    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Ventas Históricas Anuales',
                font: { size: 18 },
                padding: { top: 10, bottom: 10 },
            },
            legend: {
                position: 'top',
                labels: { usePointStyle: true },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'transparent', // Usar color en lugar de borderColor
                },
            },
            y: {
                grid: {
                    color: 'transparent', // Usar color en lugar de borderColor
                },
            },
        },
    }

    return (
        <div
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/ventas-historicas-mesanio')}
        >
            <h2 className="text-lg font-bold mb-4">
                Ventas Históricas Anuales
            </h2>
            <Line data={chartData} options={options} />
        </div>
    )
}

export default VentasHistoricoAnual
