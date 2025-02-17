import { useEffect, useState } from 'react'
import { Card, Segment } from '@/components/ui'
import Chart from 'react-apexcharts'
import { COLOR_2, COLOR_5 } from '@/constants/chart.constant'

const BasicLine = () => {
    const data = [
        {
            name: 'Desktops',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ]

    return (
        <Chart
            options={{
                responsive: [
                    {
                        breakpoint: 700,
                        options: {
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                },
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                colors: [COLOR_2],
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                    ],
                },
            }}
            series={data}
            height={300}
        />
    )
}

const CasosGraph = () => {
    const data = [
        {
            name: 'Desktops',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ]

    return (
        <Chart
            options={{
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                colors: [COLOR_5],
                xaxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                    ],
                },
            }}
            series={data}
            height={300}
        />
    )
}

const Home = () => {
    const [activeGraph, setActiveGraph] = useState('ventas')
    const [topCases, setTopCases] = useState<{ x: string | null; y: number }[]>(
        [],
    )

    useEffect(() => {
        fetch('/data/tipos_de_casos.json')
            .then((response) => response.json())
            .then((data: { data: { x: string | null; y: number }[] }) => {
                // Ordenamos los casos por 'y' en orden descendente
                const sortedCases = data.data.sort((a, b) => b.y - a.y)
                // Obtenemos los tres primeros casos más utilizados
                const top3Cases = sortedCases.slice(0, 3)
                setTopCases(top3Cases)
            })
            .catch((error) => console.error('Error loading JSON data:', error))
    }, [])

    return (
        <div className="relative">
            {/* Main grid container */}
            <div className="grid grid-cols-4 gap-4 md:h-[500px]">
                {/* Chart Section - Takes Full Height */}
                <div className="col-span-4 md:col-span-3 h-full">
                    <Card bordered={false} className="h-full flex flex-col">
                        <div className="grid grid-rows-3 gap-4 h-full">
                            <Segment className="gap-4 md:flex-row flex-col row-span-1">
                                <Segment.Item value="left" className="md:w-1/2">
                                    <div
                                        className="flex w-100 cursor-pointer"
                                        onClick={() => setActiveGraph('ventas')}
                                    >
                                        Total ventas
                                    </div>
                                </Segment.Item>
                                <Segment.Item
                                    value="right"
                                    className="md:w-1/2"
                                >
                                    <div
                                        className="flex w-100 cursor-pointer"
                                        onClick={() => setActiveGraph('casos')}
                                    >
                                        Total casos
                                    </div>
                                </Segment.Item>
                            </Segment>
                            <div className="row-span-2 flex-1">
                                {activeGraph === 'casos' ? (
                                    <CasosGraph />
                                ) : (
                                    <BasicLine />
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Cases List - Takes Full Height */}
                <div className="col-span-4 md:col-span-1 h-full">
                    <Card bordered={false} className="h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h5>Top Casos</h5>
                            <a
                                href="/tipos-de-caso"
                                className="text-blue-500 hover:underline"
                            >
                                Ver todos
                            </a>
                        </div>
                        <hr />
                        <div className="flex-1 flex flex-col justify-between mt-4">
                            <div className="casos">
                                <div className="caso1 space-y-6">
                                    {topCases.map((caseItem, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                        >
                                            <img
                                                src="/img/others/vet.png"
                                                alt={`Caso ${index + 1}`}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span>{`Caso ${index + 1}: ${caseItem.x}`}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* New "Top Clientes" section */}
            <div className="w-full mt-8">
                <Card bordered={false}>
                    <div className="flex justify-between items-center">
                        <h5>Top Clientes</h5>
                        <a
                            href="ventas-por-cliente"
                            className="text-blue-500 hover:underline"
                        >
                            Ver todos
                        </a>
                    </div>
                    <div className="clientes mt-6 space-y-6">
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className="flex items-center space-x-2"
                            >
                                <img
                                    src="/img/others/clienticon.png"
                                    alt={`Cliente ${num}`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>Cliente {num}</span>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{
                                            width: `${num * 30}%`, // Aquí puedes ajustar el porcentaje según el cliente
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Home
