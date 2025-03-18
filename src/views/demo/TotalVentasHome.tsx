import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

interface DataItem {
    nombre_grupo: string
    empresa: string
    mes_anio: string
    total_casos: string
    nombre_usuario: string
    tipo_urgencia: string
    tipo_locale: string
    total_coste: string
    total_precio: string
    margen: string
}

interface ChartData {
    series: {
        name: string
        data: number[]
    }[]
    options: ApexOptions
}

const TotalVentasHome = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const navigate = useNavigate()
    const [isScrolling, setIsScrolling] = useState(false)

    const fetchData = useCallback(() => {
        fetch('/data/casos_dashboard.json') // Conexión al archivo JSON
            .then((response) => response.json())
            .then((json) => {
                if (!Array.isArray(json)) {
                    console.error('Datos no disponibles o formato incorrecto.')
                    return
                }

                // Obtener la fecha actual sin modificar el objeto "now"
                const currentDate = new Date()
                const lastThreeMonths: string[] = []

                for (let i = 3; i >= 1; i--) {
                    const tempDate = new Date(currentDate)
                    tempDate.setMonth(currentDate.getMonth() - i)
                    const monthYear = tempDate.toISOString().slice(0, 7)
                    lastThreeMonths.push(monthYear)
                }

                console.log('Últimos tres meses:', lastThreeMonths)

                const filteredData = json.filter((item: DataItem) =>
                    lastThreeMonths.includes(item.mes_anio),
                )

                if (filteredData.length === 0) {
                    console.error(
                        'No se encontraron datos para los últimos 3 meses.',
                    )
                    return
                }

                const ventasTotalesPorMes = lastThreeMonths.map((mes) => {
                    const ventasMes = filteredData
                        .filter((item) => item.mes_anio === mes)
                        .reduce(
                            (total, item) =>
                                total + parseFloat(item.total_precio),
                            0,
                        )
                    return ventasMes
                })

                const monthsFormatted = lastThreeMonths.map((mes) => {
                    const dateObj = new Date(mes + '-01')
                    const options: Intl.DateTimeFormatOptions = {
                        month: 'long',
                        year: 'numeric',
                    }
                    return dateObj
                        .toLocaleDateString('es-ES', options)
                        .replace(/^\w/, (c) => c.toUpperCase())
                })

                const data: ChartData = {
                    series: [
                        {
                            name: 'Ingresos totales',
                            data: ventasTotalesPorMes,
                        },
                    ],
                    options: {
                        chart: {
                            type: 'line',
                            zoom: { enabled: false },
                            events: {
                                click: () =>
                                    navigate('/ingresos-historico-anual'),
                            },
                        },
                        dataLabels: { enabled: false },
                        stroke: { curve: 'smooth', width: 3 },
                        colors: ['#3B82F6'],
                        xaxis: { categories: monthsFormatted },
                        yaxis: { min: 0 },
                    },
                }

                setChartData(data)
            })
            .catch((error) => {
                console.error('Error cargando los datos:', error)
            })
    }, [navigate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            setIsScrolling(true)

            // Si el usuario deja de hacer scroll, esperamos 300ms y desactivamos el estado
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false)
            }, 300)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(scrollTimeout)
        }
    }, [])

    return (
        <div className="w-full mt-8">
            {chartData ? (
                <div
                    className="cursor-pointer"
                    onClick={
                        !isScrolling
                            ? () => navigate('/ingresos-historico-anual')
                            : undefined
                    }
                >
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        height={300}
                    />
                </div>
            ) : (
                <p>Cargando gráfico...</p>
            )}
        </div>
    )
}

export default TotalVentasHome
