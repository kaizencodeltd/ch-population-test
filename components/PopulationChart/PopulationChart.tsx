{/* 


'use client'

import styles from "./PopulationChart.module.css";
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from "react";
import { CountriesYearlyData, Country, PopulationData } from "@/types/population";

interface ChartRow extends Country {
    PopulationLabel: string;
}

function Chart({ data }: { data: ChartRow[] }) {

    data.sort((a, b) => b.Population < a.Population ? -1 : b.Population < a.Population ? 1 : 0)
        .slice(0, 20);

    return (
        <BarChart
            layout="vertical"
            width={1200}
            height={700}
            data={data}
            margin={{ top: 20, right: 120, bottom: 20, left: 40 }}
        >
            <XAxis type="number" hide />

            <YAxis
                yAxisId="left"
                type="category"
                dataKey="Country"
                width={160}
                axisLine={false}
                tickLine={false}
            />

            <YAxis
                yAxisId="right"
                type="category"
                orientation="right"
                dataKey="PopulationLabel"
                width={120}
                axisLine={false}
                tickLine={false}
            />

            <Bar
                yAxisId="left"
                dataKey="Population"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
            />

            <RechartsDevtools />
        </BarChart>
    );
}

export default function PopulationChart() {
    const [data, setData] = useState<PopulationData | null>(null);
    const [chartDataIndex, setChartDataIndex] = useState(0);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/population')
            .then((res) => res.json())
            .then((data: PopulationData) => {
                setData(data);
                setChartDataIndex(0);
                setLoading(false);

                const intervalId = window.setInterval(() => {
                    setChartDataIndex((current) => (current + 1) % data.length);
                }, 1000);

                // On clean up, clear the interval (refresh year/chart)
                return () => window.clearInterval(intervalId);

            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;

    const chartData: CountriesYearlyData = data[chartDataIndex];

    const rows: ChartRow[] = chartData.Countries.map((item) => ({
        ...item,
        PopulationLabel: item.Population.toLocaleString(),
    }));


    const year = chartData.Year;

    return (
        <div className={styles.populationChartContainer}>
            <h2>World Population By Year</h2>
            <h4>{year}</h4>
            <Chart data={rows} />
        </div>
    );
}

*/}