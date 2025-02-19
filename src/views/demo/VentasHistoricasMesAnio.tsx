import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

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
    x: string // Mes y año (e.g., 'Enero 2016')
    y: string // Valor de la venta en formato string (e.g., "1833.15")
}

const VentasHistoricasMesAnio = () => {
    const [chartData, setChartData] = useState<
        { name: string; data: number[] }[]
    >([])
    const [categories, setCategories] = useState<string[]>([])
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

                setCategories(filteredData.map((item) => item.x))
                setChartData([
                    {
                        name: 'Ventas',
                        data: filteredData.map((item) => parseFloat(item.y)),
                    },
                ])
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
                options={{
                    chart: {
                        type: 'line',
                        zoom: { enabled: false },
                    },

                    colors: [...COLORS],
                    dataLabels: { enabled: false },
                    stroke: {
                        width: 3,
                        curve: 'smooth',
                        dashArray: [0],
                    },
                    xaxis: {
                        categories: categories,
                    },
                    tooltip: {
                        x: {
                            format: 'MMMM yyyy', // Formato para mostrar Mes y Año
                        },
                        y: {
                            formatter: (val: number) => `$${val.toFixed(2)}`,
                        },
                    },
                    grid: { borderColor: '#f1f1f1' },
                }}
                series={chartData}
                height={300}
            />
        </div>
    )
}

export default VentasHistoricasMesAnio
