import { useEffect, useState, useCallback } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useNavigate } from 'react-router-dom'

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

const TotalCasosHome = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null) // Cambié a un solo objeto ChartData o null
    const navigate = useNavigate()
    const [isScrolling, setIsScrolling] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

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

                // Declaramos lastThreeMonths como un array de strings
                const lastThreeMonths: string[] = []

                // Copiar la fecha actual para no modificar el objeto original
                for (let i = 3; i >= 1; i--) {
                    const tempDate = new Date(currentDate)
                    tempDate.setMonth(currentDate.getMonth() - i)
                    const monthYear = tempDate.toISOString().slice(0, 7) // 'YYYY-MM'
                    lastThreeMonths.push(monthYear)
                }

                // Imprimir los valores de los meses para ver qué meses se calculan
                console.log('Últimos tres meses:', lastThreeMonths)

                // Filtrar los datos para obtener solo los de los últimos tres meses
                const filteredData = json.filter((item: DataItem) =>
                    lastThreeMonths.includes(item.mes_anio),
                )

                if (filteredData.length === 0) {
                    console.error(
                        'No se encontraron datos para los últimos 3 meses.',
                    )
                    return
                }

                // Calcular las ventas totales por mes
                const ventasTotalesPorMes = lastThreeMonths.map((mes) => {
                    const ventasMes = filteredData
                        .filter((item) => item.mes_anio === mes)
                        .reduce(
                            (total, item) =>
                                total + parseFloat(item.total_casos),
                            0,
                        )
                    return ventasMes
                })

                // Formatear los meses para que se muestren de forma legible (Enero 2025)
                const monthsFormatted = lastThreeMonths.map((mes) => {
                    const dateObj = new Date(mes + '-01')
                    const options: Intl.DateTimeFormatOptions = {
                        month: 'long',
                        year: 'numeric',
                    }
                    // Aquí ajustamos la capitalización usando charAt(0).toUpperCase()
                    return dateObj
                        .toLocaleDateString('es-ES', options)
                        .replace(/^\w/, (c) => c.toUpperCase()) // Capitaliza la primera letra
                })

                // Definir los datos del gráfico
                const data: ChartData = {
                    series: [
                        {
                            name: 'Casos totales',
                            data: ventasTotalesPorMes,
                        },
                    ],
                    options: {
                        chart: {
                            type: 'line',
                            zoom: {
                                enabled: false,
                            },
                            events: {
                                click: () => {
                                    if (!isMobile || !isScrolling) {
                                        navigate('/casos-historico-anual')
                                    }
                                },
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 3,
                        },
                        colors: ['#3B82F6'], // Color del gráfico
                        xaxis: {
                            categories: monthsFormatted,
                        },
                        yaxis: {
                            min: 0, // Asegurar que el eje Y empieza en 0
                        },
                    },
                }

                setChartData(data)
            })
            .catch((error) => {
                console.error('Error cargando los datos:', error)
            })
    }, [])

    useEffect(() => {
        fetchData() // Llamar la función cuando se monte el componente
    }, [fetchData])
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768) // Detecta si estamos en responsive (menos de 768px)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!isMobile) return // Solo aplicamos la lógica si estamos en responsive

        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            setIsScrolling(true)
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
    }, [isMobile])

    return (
        <div className="w-full mt-8">
            {chartData ? (
                <div
                    className="cursor-pointer"
                    onClick={
                        !isScrolling
                            ? () => navigate('/casos-historico-anual')
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

export default TotalCasosHome
