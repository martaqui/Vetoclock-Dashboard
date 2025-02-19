import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'
import { ApexOptions } from 'apexcharts'

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

interface DataItem {
    x: string
    y: number
}

interface ChartData {
    series: {
        name: string
        data: number[]
    }[]
    options: ApexOptions
}

const CasosHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [selectedYear, setSelectedYear] = useState<string>('')

    useEffect(() => {
        fetch('/data/casos_por_anio_mes.json')
            .then((response) => response.json())
            .then((data: { data: DataItem[] }) => {
                const filteredData = data.data.filter((item) => {
                    const [itemMonth, itemYear] = item.x.split(' ')
                    const translatedMonth =
                        monthsTranslations[
                            itemMonth as keyof typeof monthsTranslations
                        ]

                    if (!translatedMonth || !itemYear) return false // Previene errores si hay valores inválidos

                    const itemDate = new Date(`${translatedMonth} ${itemYear}`)

                    return (
                        (!startDate || itemDate >= startDate) &&
                        (!endDate || itemDate <= endDate)
                    )
                })

                setChartData({
                    series: [
                        {
                            name: 'Casos por Año',
                            data: filteredData.map((item) => item.y),
                        },
                    ],
                    options: {
                        chart: {
                            type: 'line',
                            zoom: { enabled: false },
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 3,
                        },
                        dataLabels: { enabled: false },
                        xaxis: {
                            categories: filteredData.map((item) => item.x),
                            type: 'category',
                            tickAmount: 12, // Asegura que los 12 meses se muestren
                            labels: {
                                rotate: -45, // Inclina las etiquetas para evitar superposición
                                minHeight: 40, // Evita que se recorten los meses
                                style: { fontSize: '12px' },
                            },
                        },
                        yaxis: { opposite: true },
                        legend: { horizontalAlign: 'left' },
                    },
                })
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [startDate, endDate])

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value
        if (year !== '--') {
            const newYear = parseInt(year, 10)
            setSelectedYear(newYear.toString())
            setStartDate(new Date(newYear, 0))
            setEndDate(new Date(newYear, 11, 31))
        } else {
            setSelectedYear(year)
            setStartDate(null)
            setEndDate(null)
        }
    }

    if (!chartData) return <div>Loading...</div>

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
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={400}
                width={900}
            />
        </div>
    )
}

export default CasosHistoricoAnual
