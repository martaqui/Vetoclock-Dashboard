import { useEffect, useState, useCallback } from 'react'
import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom'
import { COLOR_1 } from '@/constants/chart.constant'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

interface DataItem {
    nombre_grupo: string
    empresa: string
    mes_anio: string
    total_casos: string
    nombre_usuario: string
    tipo_urgencia: string
}

interface ChartData {
    series: {
        name: string
        data: number[]
    }[]
    options: ApexOptions
}

const obtenerFechaEnEspañol = (fecha: string) => {
    const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ]

    // Crear una nueva fecha con el formato 'YYYY-MM'
    const fechaObj = new Date(fecha + '-01') // Añadimos el día 1 para convertirlo en un objeto Date válido

    // Obtener el mes y el año
    const mes = meses[fechaObj.getMonth()] // getMonth() devuelve el índice del mes (0-11)
    const año = fechaObj.getFullYear() // Obtener el año

    return `${mes} ${año}` // Devolver el resultado en formato 'Mes Año'
}

const convertirFechaAFormato = (fecha: Date) => {
    // Obtener el año y el mes
    const año = fecha.getFullYear()
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // getMonth() devuelve un índice de 0 a 11, por lo que sumamos 1

    // Formatear como 'YYYY-MM'
    return `${año}-${mes}`
}

const CasosHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [tipoUrgencia, setTipoUrgencia] = useState<string>('')
    const [tiposUrgencia, setTiposUrgencia] = useState<string[]>([])
    const [items, setItems] = useState<DataItem[]>([]) // Datos originales
    const [startDate, setStartDate] = useState(
        () => new Date(new Date().setMonth(new Date().getMonth() - 3)),
    )
    const [endDate, setEndDate] = useState(new Date())

    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        navigate('/casos_historico_anual_mes_anio')
    }, [navigate])

    useEffect(() => {
        fetch('/data/casos_dashboard.json')
            .then((response) => response.json())
            .then((data: DataItem[] | { data: DataItem[] }) => {
                //parsedData es parea almacenar la estructura que tenga la variable Data
                const parsedData: DataItem[] = Array.isArray(data)
                    ? data
                    : data.data

                if (!parsedData || parsedData.length === 0) {
                    console.error('No hay datos disponibles')
                    return
                }
                setItems(parsedData)

                //aqui estamos cogiendo los dos tipos de valores que tiene tipo_urgencia y guardandolos en el estado de TiposUrgencia
                const uniqueUrgencias = Array.from(
                    new Set(parsedData.map((item) => item.tipo_urgencia)),
                )
                setTiposUrgencia(uniqueUrgencias)
            })
            .catch((error) =>
                console.error('Error al cargar los datos JSON:', error),
            )
    }, [])

    useEffect(() => {
        if (items.length === 0) return
        // aqui utilizo el metodo reduce para reducir los casos a un solo valor y meterlo en el objeto grouped
        const grouped = items.reduce<{
            [key: string]: { total: number; filtro: number } // aqui decimos que mes_anio, su clave es string
        }>((acc, item) => {
            const casos = parseInt(item.total_casos, 10) || 0 // aqui, como total_casos es un string en el json, lo pasamos a numero
            const key = item.mes_anio
            acc[key] = acc[key] || { total: 0, filtro: 0 }
            acc[key].total += casos //suma de los casos totales
            if (!tipoUrgencia || item.tipo_urgencia === tipoUrgencia) {
                acc[key].filtro += casos
            }
            return acc
        }, {})

        const fechasOrdenadas = Object.keys(grouped).reverse()

        const data = fechasOrdenadas.filter((item) => {
            const fechaInicial = convertirFechaAFormato(startDate)
            const fechaFinal = convertirFechaAFormato(endDate)

            if (fechaInicial && fechaFinal) {
                return (
                    item.toString() >= fechaInicial &&
                    item.toString() <= fechaFinal
                )
            }

            if (fechaInicial) {
                return item.toString() >= fechaInicial
            }

            if (fechaFinal) {
                return item.toString() >= fechaFinal
            }

            return item
        })

        setChartData({
            series: [
                {
                    name: 'Casos Filtrados',
                    data: data.map((date) => grouped[date].filtro),
                },
                {
                    name: 'Total Casos',
                    data: data.map((date) => grouped[date].total),
                },
            ],
            options: {
                chart: {
                    type: 'line',
                    zoom: { enabled: false },
                    events: { click: handleClick },
                },
                colors: [COLOR_1, '#D3D3D3'], // Filtrados en color principal, total en gris
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 80, 100],
                    },
                },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                xaxis: {
                    categories: data.map(obtenerFechaEnEspañol),
                    type: 'category',
                },
                yaxis: {
                    opposite: true,
                    max: 500, // Fijo el máximo d y en 500
                },
                legend: { horizontalAlign: 'left' },
            },
        })
    }, [tipoUrgencia, items, handleClick, startDate, endDate])

    if (!chartData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Casos Históricos Anual</h2>
            <div className="mb-4">
                <label className="mr-2">Filtrar por tipo de urgencia:</label>
                <select
                    className="p-2 border rounded"
                    value={tipoUrgencia}
                    onChange={(e) => setTipoUrgencia(e.target.value)}
                >
                    <option value="">Todos</option>
                    {tiposUrgencia.map((urgencia) => (
                        <option key={urgencia} value={urgencia}>
                            {urgencia}
                        </option>
                    ))}
                </select>
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>
            <div onClick={handleClick}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={300}
                />
            </div>
        </div>
    )
}

export default CasosHistoricoAnual
