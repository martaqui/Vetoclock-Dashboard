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
    TooltipItem,
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

const VentasHistoricoAnual = () => {
    const [chartData, setChartData] = useState<any>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/ventas_dataset_anual.json')
            .then((response) => response.json())
            .then((data) => {
                setChartData({
                    labels: data.data.map((item: { x: string }) => item.x),
                    datasets: [
                        {
                            label: 'Ventas Anuales',
                            data: data.data.map((item: { y: string }) =>
                                parseFloat(item.y),
                            ),
                            borderColor: COLORS[0], // Mantiene el mismo color que en ApexCharts
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            tension: 0.3, // Hace la línea más fluida
                        },
                    ],
                })
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
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'line'>) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString(
                            'es-ES',
                            {
                                style: 'currency',
                                currency: 'EUR',
                            },
                        )}`
                    },
                },
            },
        },
        scales: {
            x: { grid: { drawBorder: false } },
            y: { grid: { drawBorder: false } },
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
