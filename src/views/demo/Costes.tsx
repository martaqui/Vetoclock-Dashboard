import { useEffect, useState, useCallback } from 'react'
import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom'
import { COLOR_1 } from '@/constants/chart.constant'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'
import TopList from './TopList/TopList'

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

interface Cliente {
    x: string
    y: number
    porcentaje: number
}

interface Especialista {
    x: string
    y: number
    porcentaje: number
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
    const fechaObj = new Date(fecha + '-01')
    const mes = meses[fechaObj.getMonth()]
    const año = fechaObj.getFullYear()
    return `${mes} ${año}`
}

const convertirFechaAFormato = (fecha: Date) => {
    const año = fecha.getFullYear()
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    return `${año}-${mes}`
}

const Costes = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [tipoUrgencia, setTipoUrgencia] = useState<string>('')
    const [tiposUrgencia, setTiposUrgencia] = useState<string[]>([])
    const [grupo, setGrupo] = useState<string>('')
    const [grupos, setGrupos] = useState<string[]>([])
    const [items, setItems] = useState<DataItem[]>([])
    const [startDate, setStartDate] = useState(
        () => new Date(new Date().setMonth(new Date().getMonth() - 3)),
    )
    const [endDate, setEndDate] = useState(new Date())
    const [empresa, setEmpresa] = useState<string>('')
    const [empresas, setEmpresas] = useState<string[]>([])
    const [topClientes, setTopClientes] = useState<Cliente[]>([])
    const [topEspecialistas, setTopEspecialistas] = useState<Especialista[]>([])
    const [tipoCaso, setTipoCaso] = useState<string>('')
    const [tiposCaso, setTiposCaso] = useState<string[]>([])
    const [especialista, setEspecialista] = useState<string>('')
    const [especialistas, setEspecialistas] = useState<string[]>([])
    const [totalCasos, setTotalCasos] = useState<number>(0)
    const [totalCasosAnioAnterior, setTotalCasosAnioAnterior] =
        useState<number>(0)
    const [diferencia, setDiferencia] = useState<number>(0)
    const [variacionPorcentaje, setVariacionPorcentaje] = useState<number>(0)

    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        navigate('/casos_historico_anual_mes_anio')
    }, [navigate])

    useEffect(() => {
        fetch('/data/casos_dashboard.json')
            .then((response) => response.json())
            .then((data: DataItem[] | { data: DataItem[] }) => {
                const parsedData: DataItem[] = Array.isArray(data)
                    ? data
                    : data.data
                if (!parsedData || parsedData.length === 0) {
                    console.error('No hay datos disponibles')
                    return
                }
                setItems(parsedData)

                setGrupos(
                    Array.from(
                        new Set(parsedData.map((item) => item.nombre_grupo)),
                    ).sort(), // Ordenar grupos alfabéticamente
                )

                // Ordenar empresas alfabéticamente

                setTiposUrgencia(
                    Array.from(
                        new Set(parsedData.map((item) => item.tipo_urgencia)),
                    ).sort(), // Ordenar tipos de urgencia alfabéticamente
                )

                setTiposCaso(
                    Array.from(
                        new Set(parsedData.map((item) => item.tipo_locale)),
                    ).sort(), // Ordenar tipos de caso alfabéticamente
                )
                setEspecialistas(
                    Array.from(
                        new Set(parsedData.map((item) => item.nombre_usuario)),
                    ).sort(),
                )
            })
            .catch((error) =>
                console.error('Error al cargar los datos JSON:', error),
            )
    }, [])
    useEffect(() => {
        if (grupo) {
            // Filtrar las empresas del grupo seleccionado
            const empresasFiltradas = [
                ...new Set(
                    items
                        .filter((item) => item.nombre_grupo === grupo)
                        .map((item) => item.empresa),
                ),
            ].sort()
            setEmpresas(empresasFiltradas)

            // Si la empresa seleccionada ya no está disponible, la reseteamos
            if (!empresasFiltradas.includes(empresa)) {
                setEmpresa('')
            }
        } else {
            // Si no hay grupo seleccionado, mostrar todas las empresas
            setEmpresas([...new Set(items.map((item) => item.empresa))])
        }
    }, [grupo, items])
    // Se agregan 'empresa' y 'todasLasEmpresas'

    useEffect(() => {
        fetch('/data/ventasxcliente.json')
            .then((response) => response.json())
            .then((data: { data: Cliente[] }) => {
                const clientesFiltrados: Cliente[] = data.data
                    .filter((item) => item.x !== null)
                    .map((item) => ({
                        x: item.x || 'Cliente Desconocido',
                        y: item.y,
                        porcentaje: 0, // Inicializamos con 0
                    }))

                // Ordenamos de mayor a menor
                const sortedClientes = clientesFiltrados.sort(
                    (a, b) => b.y - a.y,
                )

                // Calculamos el total de ventas
                const totalVentas = sortedClientes.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                // Asignamos los porcentajes correctos
                const clientesConPorcentaje = sortedClientes.map((cliente) => ({
                    ...cliente,
                    porcentaje:
                        totalVentas > 0 ? (cliente.y / totalVentas) * 100 : 0,
                }))

                // Tomamos solo los 3 clientes con mayor porcentaje
                setTopClientes(clientesConPorcentaje.slice(0, 3))
            })
            .catch((error) => console.error('Error loading JSON data:', error))

        fetch('/data/costesxespecialista.json')
            .then((response) => response.json())
            .then((data: { data: Especialista[] }) => {
                const especialistasFiltrados: Especialista[] = data.data.map(
                    (item) => ({
                        x: item.x,
                        y: item.y,
                        porcentaje: 0, // Inicializamos en 0
                    }),
                )

                // Obtener la suma total de costos de todos los especialistas
                const totalCostes = especialistasFiltrados.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                // Calcular el porcentaje correctamente
                const especialistasConPorcentaje = especialistasFiltrados.map(
                    (especialista) => ({
                        ...especialista,
                        porcentaje:
                            totalCostes > 0
                                ? (especialista.y / totalCostes) * 100
                                : 0,
                    }),
                )

                // Ordenar de mayor a menor y seleccionar los 3 primeros
                setTopEspecialistas(
                    especialistasConPorcentaje
                        .sort((a, b) => b.y - a.y)
                        .slice(0, 3),
                )
            })
            .catch((error) =>
                console.error('Error cargando especialistas:', error),
            )
    }, [])

    useEffect(() => {
        if (especialista) {
            // Filtrar tipos de caso del especialista seleccionado
            const tiposDeCasoFiltrados = [
                ...new Set(
                    items
                        .filter((item) => item.nombre_usuario === especialista) // Filtra por especialista
                        .map((item) => item.tipo_locale), // Extrae los tipos de casos
                ),
            ].sort() // Ordenar alfabéticamente
            setTiposCaso(tiposDeCasoFiltrados)
        } else {
            // Si no hay especialista seleccionado, mostrar todos los tipos de caso
            setTiposCaso(
                [...new Set(items.map((item) => item.tipo_locale))].sort(),
            )
        }
    }, [especialista, items]) // Dependencias: especialista y items

    useEffect(() => {
        if (items.length === 0) return

        const fechaInicial = convertirFechaAFormato(startDate)
        const fechaFinal = convertirFechaAFormato(endDate)

        const startDateLastYear = new Date(startDate)
        startDateLastYear.setFullYear(startDate.getFullYear() - 1)
        const endDateLastYear = new Date(endDate)
        endDateLastYear.setFullYear(endDate.getFullYear() - 1)

        const fechaInicialAnterior = convertirFechaAFormato(startDateLastYear)
        const fechaFinalAnterior = convertirFechaAFormato(endDateLastYear)

        const grouped = items.reduce<{
            [key: string]: { total: number; filtro: number }
        }>((acc, item) => {
            if (grupo && item.nombre_grupo !== grupo) return acc
            if (especialista && item.nombre_usuario !== especialista) return acc
            if (empresa && empresa !== '' && item.empresa !== empresa)
                return acc
            if (tipoCaso && item.tipo_locale !== tipoCaso) return acc

            const key = item.mes_anio
            const casos = parseInt(item.total_coste, 10) || 0

            if (key >= fechaInicial && key <= fechaFinal) {
                acc[key] = acc[key] || { total: 0, filtro: 0 }
                acc[key].total += casos
                if (!tipoUrgencia || item.tipo_urgencia === tipoUrgencia) {
                    acc[key].filtro += casos
                }
            }

            return acc
        }, {})
        const totalCasosCalculado = Object.values(grouped).reduce(
            (sum, item) => sum + item.filtro,
            0,
        )

        // 🔥 Agrupar los casos del año anterior
        const groupedAnioAnterior = items.reduce<{
            [key: string]: { total: number; filtro: number }
        }>((acc, item) => {
            if (grupo && item.nombre_grupo !== grupo) return acc
            if (especialista && item.nombre_usuario !== especialista) return acc
            if (empresa && empresa !== '' && item.empresa !== empresa)
                return acc
            if (tipoCaso && item.tipo_locale !== tipoCaso) return acc

            const key = item.mes_anio
            const casos = parseInt(item.total_coste, 10) || 0

            if (key >= fechaInicialAnterior && key <= fechaFinalAnterior) {
                acc[key] = acc[key] || { total: 0, filtro: 0 }
                acc[key].total += casos
                if (!tipoUrgencia || item.tipo_urgencia === tipoUrgencia) {
                    acc[key].filtro += casos
                }
            }

            return acc
        }, {})

        const totalCasosAnioAnteriorCalculado = Object.values(
            groupedAnioAnterior,
        ).reduce((sum, item) => sum + item.filtro, 0)

        setTotalCasos(totalCasosCalculado)
        setTotalCasosAnioAnterior(totalCasosAnioAnteriorCalculado)
        const diferencia = totalCasosCalculado - totalCasosAnioAnteriorCalculado
        // 🔥 Calcular la variación en porcentaje
        const variacionPorcentaje =
            totalCasosAnioAnteriorCalculado > 0
                ? ((totalCasosCalculado - totalCasosAnioAnteriorCalculado) /
                      totalCasosAnioAnteriorCalculado) *
                  100
                : 0 // Evitar división por 0

        // 🔥 Guardar la diferencia en el estado
        setDiferencia(diferencia)
        setVariacionPorcentaje(variacionPorcentaje)

        const fechasOrdenadas = Object.keys(grouped).reverse()
        const data = fechasOrdenadas.filter((item) => {
            const fechaInicial = convertirFechaAFormato(startDate)
            const fechaFinal = convertirFechaAFormato(endDate)
            return item >= fechaInicial && item <= fechaFinal
        })

        // 📊 Obtener el valor máximo dinámico
        const maxTotal = Math.max(...data.map((date) => grouped[date].total), 0)
        const maxFiltrado = Math.max(
            ...data.map((date) => grouped[date].filtro),
            0,
        )
        const maxY = Math.max(maxTotal, maxFiltrado) || 10 // Evita 0 como máximo

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
                colors: [COLOR_1, '#D3D3D3'],
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
                yaxis: { opposite: true, max: maxY }, // 🔥 Se ajusta dinámicamente
                legend: { horizontalAlign: 'left' },
            },
        })
    }, [
        tipoUrgencia,
        grupo,
        items,
        handleClick,
        startDate,
        endDate,
        empresa,
        tipoCaso,
        especialista, // Asegúrate de que esto también esté como dependencia
    ])

    if (!chartData) return <div>Loading...</div>
    console.log('Empresas en el select:', empresas)

    const maxClientes = Math.max(
        totalCasos,
        totalCasosAnioAnterior, // 🔥 Ahora este valor es correcto
        ...topClientes.map((cliente) => cliente.y || 1), // Evitar errores con 1
    )

    const totalCasosAnioAnteriorPercent =
        maxClientes > 0
            ? Math.max((totalCasosAnioAnterior / maxClientes) * 100, 30) // 🔥 Ajuste dinámico
            : 0

    // Asegurar que la barra de "Total Casos" nunca se vea demasiado pequeña
    const totalCasosPercent =
        maxClientes > 0
            ? Math.max((totalCasos / maxClientes) * 100, 30) // 🔥 Nunca será menor al 30%
            : 0
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Costes Especialistas
            </h2>

            {/* Contenedor de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Filtro por Grupo */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Filtrar por grupo:
                    </label>
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={grupo}
                        onChange={(e) => setGrupo(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {grupos.map((grp) => (
                            <option key={grp} value={grp}>
                                {grp}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Empresa */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Filtrar por empresa:
                    </label>
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {empresas.map((empr) => (
                            <option key={empr} value={empr}>
                                {empr}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Filtrar por tipo de caso:
                    </label>
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={tipoCaso}
                        onChange={(e) => setTipoCaso(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {tiposCaso.map((caso) => (
                            <option key={caso} value={caso}>
                                {caso}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Filtro por Tipo de Urgencia */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Filtrar por tipo de urgencia:
                    </label>
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">
                        Filtrar por especialista:
                    </label>
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={especialista}
                        onChange={(e) => setEspecialista(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {especialistas.map((esp) => (
                            <option key={esp} value={esp}>
                                {esp}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Selector de Fechas */}
            <div className="mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            {/* Gráfico */}
            <div className="cursor-pointer" onClick={handleClick}>
                {' '}
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={300}
                />
            </div>

            <hr />

            <TopList
                title="Top Clientes"
                link="ventas-por-cliente"
                linkText="Ver todos"
                items={[
                    {
                        x: 'Total Casos',
                        porcentaje: totalCasosPercent,
                        y: totalCasos, // 🔥 Se mantiene el total en la primera fila
                    },
                    {
                        x: `Variación`,
                        porcentaje: totalCasosAnioAnteriorPercent, // 🔥 La barra sigue siendo proporcional
                        y: diferencia, // 🔥 En lugar del total del año anterior, mostramos la diferencia
                    },
                    {
                        x: 'Variación %',
                        porcentaje: Math.min(
                            Math.abs(variacionPorcentaje),
                            100,
                        ),
                        y: Number(variacionPorcentaje.toFixed(2)), // 🔥 Convertimos a número
                    },
                ]}
                icon="/img/others/clienticon.png"
            />
        </div>
    )
}

export default Costes
