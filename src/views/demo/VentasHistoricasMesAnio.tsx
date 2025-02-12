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
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const monthsTranslations = {
    Enero: 'January',
    Febrero: 'February',
    Marzo: 'March',
    Abril: 'April',
    Mayo: 'May',
    Junio: 'June',
    Julio: 'July',
    Agosto: 'August',
    Septiembre: 'September',
    Octubre: 'October',
    Noviembre: 'November',
    Diciembre: 'December',
}

// Tipos para los datos del JSON y el estado
interface DataItem {
    x: string // Mes y año (e.g., 'Enero 2016')
    y: string // Valor de la venta en formato string (e.g., "1833.15")
}

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

const VentasHistoricasMesAnio = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [selectedYear, setSelectedYear] = useState<string>('')

    useEffect(() => {
        fetch('/data/ventas_historicas_mesanio.json')
            .then((response) => response.json())
            .then((data) => {
                const filteredData = (data.data as DataItem[]).filter(
                    (item) => {
                        const itemMonth = item.x.split(' ')[0]
                        const itemYear = item.x.split(' ')[1]

                        const translatedMonth =
                            monthsTranslations[
                                itemMonth as keyof typeof monthsTranslations
                            ]

                        const itemDate = new Date(
                            `${translatedMonth} ${itemYear}`,
                        )
                        return (
                            (!startDate || itemDate >= startDate) &&
                            (!endDate || itemDate <= endDate)
                        )
                    },
                )

                setChartData({
                    labels: filteredData.map((item) => item.x),
                    datasets: [
                        {
                            label: 'Dataset 1',
                            data: filteredData.map((item) =>
                                parseFloat(item.y),
                            ), // Convertir a número
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [startDate, endDate])

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value
        if (year !== '--') {
            const newYear = parseInt(year, 10)
            const newStartDate = new Date(newYear, 0) // Enero
            const newEndDate = new Date(newYear, 11, 31) // Diciembre 31
            setSelectedYear(newYear.toString())
            setStartDate(newStartDate)
            setEndDate(newEndDate)
        } else {
            setSelectedYear(year)
            setStartDate(null)
            setEndDate(null)
        }
    }

    if (!chartData) {
        return <div>Loading...</div>
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<'line'>) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`
                    },
                },
            },
        },
    }

    return (
        <div>
            <DatePickerComponent
                startDate={startDate}
                endDate={endDate}
                selectedYear={selectedYear}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleYearChange={handleYearChange}
            />
            <Line data={chartData} options={options} />
        </div>
    )
}

export default VentasHistoricasMesAnio
