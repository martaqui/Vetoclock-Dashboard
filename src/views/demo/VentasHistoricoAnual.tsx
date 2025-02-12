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

interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string
        borderColor: string
        borderWidth: number
        fill: boolean
    }[]
}

const VentasHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/ventas_dataset_anual.json')
            .then((response) => response.json())
            .then((data) => {
                setChartData({
                    labels: data.data.map(
                        (item: { x: string; y: string }) => item.x,
                    ),
                    datasets: [
                        {
                            label: 'Ventas Anuales',
                            data: data.data.map(
                                (item: { x: string; y: string }) =>
                                    parseFloat(item.y),
                            ),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false,
                        },
                    ],
                })
            })
            .catch((error) => console.error('Error cargando JSON:', error))
    }, [])

    if (!chartData) {
        return <div>Cargando...</div>
    }

    // Definir opciones del gráfico con tipado correcto
    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Ventas Históricas Anuales', // Aquí defines el título
                font: {
                    size: 18,
                },
                padding: {
                    top: 10,
                    bottom: 10,
                },
            },
            legend: {
                position: 'top',
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
    }
    const handleClick = () => {
        navigate('/ventas-historicas-mesanio')
    }
    return (
        <div onClick={handleClick}>
            <Line data={chartData} options={options} />
        </div>
    )
}

export default VentasHistoricoAnual
