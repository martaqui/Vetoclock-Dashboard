import { Card, Segment } from '@/components/ui'
import Chart from 'react-apexcharts'
import { COLOR_2, COLOR_5 } from '@/constants/chart.constant'
import { useState } from 'react'

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

    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
                <Card bordered={false}>
                    <div className="grid grid-rows-3 gap-4">
                        <Segment className="gap-4 md:flex-row flex-col row-span-1">
                            <Segment.Item value="left" className="md:w-1/2">
                                <div
                                    className="flex w-100 cursor-pointer"
                                    onClick={() => setActiveGraph('ventas')}
                                >
                                    Total ventas
                                </div>
                            </Segment.Item>
                            <Segment.Item value="right" className="md:w-1/2">
                                <div
                                    className="flex w-100 cursor-pointer"
                                    onClick={() => setActiveGraph('casos')}
                                >
                                    Total casos
                                </div>
                            </Segment.Item>
                        </Segment>
                        <div className="row-span-2">
                            {activeGraph === 'casos' ? (
                                <CasosGraph />
                            ) : (
                                <BasicLine />
                            )}
                        </div>
                    </div>
                </Card>
            </div>
            <Card bordered={false}>
                <h5>Card title</h5>
                <p>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                </p>
            </Card>
        </div>
    )
}

export default Home
