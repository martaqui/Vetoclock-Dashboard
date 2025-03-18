import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

interface CasoDashboard {
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

const convertirFechaAFormato = (fecha: Date) => {
    const año = fecha.getFullYear()
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    return `${año}-${mes}`
}

const CasosPorGrupo = () => {
    const [chartData, setChartData] = useState<{
        options: ApexOptions
        series: number[]
        labels: string[]
    } | null>(null)

    const [mostrarTodos, setMostrarTodos] = useState(false) // Estado para alternar entre 4 y todos los grupos
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/casos_dashboard.json')
            .then((response) => response.json())
            .then((data: CasoDashboard[]) => {
                // 🔥 Si no hay fechas seleccionadas, mostramos todos los datos
                const fechaInicial = startDate
                    ? convertirFechaAFormato(startDate)
                    : '0000-00'
                const fechaFinal = endDate
                    ? convertirFechaAFormato(endDate)
                    : '9999-99'

                // 🔥 Filtrar por fechas solo si están seleccionadas
                const datosFiltrados = data.filter(
                    (item) =>
                        item.mes_anio >= fechaInicial &&
                        item.mes_anio <= fechaFinal,
                )

                // 🔥 Agrupar por "nombre_grupo" y calcular ingresos totales (total_precio)
                const grupoIngresos: Record<string, number> = {}

                datosFiltrados.forEach((item) => {
                    const grupo = item.nombre_grupo || 'Sin Grupo'
                    const ingresos = parseFloat(item.total_precio) || 0 // Convertir total_precio a número
                    grupoIngresos[grupo] =
                        (grupoIngresos[grupo] || 0) + ingresos
                })

                // 🔥 Ordenar los grupos por ingresos (de mayor a menor)
                const gruposOrdenados = Object.entries(grupoIngresos).sort(
                    ([, ingresosA], [, ingresosB]) => ingresosB - ingresosA,
                )

                // 🔥 Definir cuántos grupos mostrar (4 o todos)
                const gruposMostrados = mostrarTodos
                    ? gruposOrdenados
                    : gruposOrdenados.slice(0, 4)

                // Extraer etiquetas y valores para el gráfico
                const labels = gruposMostrados.map(([grupo]) => grupo)
                const series = gruposMostrados.map(([, ingresos]) => ingresos)
                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            width: 'auto',
                            events: {
                                dataPointSelection: (
                                    event,
                                    chartContext,
                                    config,
                                ) => {
                                    const selectedIndex = config.dataPointIndex
                                    const selectedGroup = labels[selectedIndex]

                                    console.log(
                                        'Grupo seleccionado:',
                                        selectedGroup,
                                    )
                                    setTimeout(() => {
                                        navigate(
                                            `/ventas_por_grupo/${selectedGroup}`,
                                        )
                                    }, 100)
                                },
                            },
                        },
                        labels: labels,
                        colors: [
                            '#FF6B00', // Naranja fuerte
                            '#FFA600', // Amarillo-naranja
                            '#FFC100', // Naranja suave
                            '#FFD700', // Dorado
                            '#FF8C42', // Naranja pastel
                            '#FFAE42', // Amarillo oscuro
                        ],
                        tooltip: {
                            theme: 'dark',
                            y: {
                                formatter: (value: number) =>
                                    value.toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }) + '€',
                            },
                        },
                        dataLabels: {
                            formatter: (value: number) =>
                                value.toFixed(2) + '%', // 🔥 Mostrar porcentaje en sectores
                        },
                        plotOptions: {
                            pie: {
                                expandOnClick: true,
                                customScale: 1.1,
                                donut: {
                                    size: '0%',
                                },
                            },
                        },
                        title: {
                            align: 'left',
                            offsetX: 10,
                            style: {
                                fontSize: '25px',
                                fontWeight: 'bold',
                                color: '#000000',
                            },
                        },
                        legend: {
                            position: 'right',
                        },
                    },
                    series: series,
                    labels: labels,
                })
            })
            .catch((error) =>
                console.error('Error cargando casos_dashboard.json:', error),
            )
    }, [navigate, mostrarTodos, startDate, endDate]) // 🔥 Se actualiza cuando cambia el rango de fechas

    if (!chartData) {
        return <div className="text-center text-lg">Cargando...</div>
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4 text-xl font-bold text-black">
                Ingresos por grupo:
            </div>

            {/* 🔥 Selector de Fechas */}
            <div className="mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            <Chart
                options={chartData.options}
                series={chartData.series}
                height={390}
                type="pie"
            />

            {/* 🔥 Botón para alternar entre ver solo 4 grupos o todos */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => setMostrarTodos(!mostrarTodos)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                    {mostrarTodos ? 'Mostrar menos' : 'Ver más grupos'}
                </button>
            </div>
        </div>
    )
}

export default CasosPorGrupo
