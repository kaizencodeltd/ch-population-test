'use client'

import styles from "./PopulationChart2.module.css";
import { useEffect, useMemo, useState } from "react";
import { CountriesYearlyData, Country, PopulationData } from "@/types/population";
import { motion } from "motion/react";
import { toHash } from "@/utils/hashing";

// Time before we move onto the next year
const goToNextYearInterval = 650;
// Controls the animation speed for the bar resizing when transitioning to the next year
const chartBarAnimSpeed = goToNextYearInterval / 1000;
const chartRowMoveAnimSpeed = Math.max(goToNextYearInterval / 1000 * 0.2, 0.15);

interface ChartRow extends Country {
    PopulationLabel: string;
    Color: string;
}

// Static palette of colors in a random order
// Colors are assigned in getCountryColor()
const palette = [
    '#5B8FF9',
    '#61DDAA',
    '#65789B',
    '#F6BD16',
    '#7262FD',
    '#78D3F8',
    '#9661BC',
    '#F6903D',
    '#008685',
    '#F08BB4',
];

function Chart({ data, prevData, countriesToDisplayCount }: { data: ChartRow[]; prevData: ChartRow[] | null; countriesToDisplayCount: number }) {
    // Sort by Population, take top {countriesToDisplayCount}
    // memo the result to avoid recomputation

    const sortedData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.Population - a.Population)
            .slice(0, countriesToDisplayCount);
    }, [data, countriesToDisplayCount]);

    const prevSortedData = useMemo(() => {
        if (!prevData) return null;

        return [...prevData]
            .sort((a, b) => b.Population - a.Population)
            .slice(0, countriesToDisplayCount);
    }, [prevData, countriesToDisplayCount]);


    // List of countries that have changed their placing compared to the previous year
    // Might be a bit of an overkill to be honest, but it allows us to have the bar transitions to
    // take full amount of time available (goToNextYearInterval) for countries that have remained in the same position
    // while for countries with a different position the bar resizing will take goToNextYearInterval (in ms) - chartRowMoveAnimSpeed
    // as the resizing will start after the row has been moved to the new position and will be as fast as
    // teh remaining time before the year changes again.
    const movedCountries = useMemo(() => {
        if (!prevSortedData) {
            return new Set<string>();
        }

        const prevIndexMap = new Map<string, number>();
        prevSortedData.forEach((row, index) => {
            prevIndexMap.set(row.Country, index);
        });

        const moved = new Set<string>();

        sortedData.forEach((row, index) => {
            const prevIndex = prevIndexMap.get(row.Country);
            if (prevIndex === undefined || prevIndex !== index) {
                moved.add(row.Country);
            }
        });

        return moved;
    }, [sortedData, prevSortedData]);

    if (sortedData.length === 0)
        return null;

    const maxPopulation = sortedData[0].Population;

    return (
        <div className={styles.chart}>
            {sortedData.map((row) => {
                const barWidth = `${(row.Population / maxPopulation) * 100}%`;
                const hasMoved = movedCountries.has(row.Country);

                return (
                    <motion.div
                        key={row.Country}
                        layout
                        className={styles.row}
                        transition={{ layout: { duration: chartRowMoveAnimSpeed } }}
                    >
                        <div className={styles.country}>{row.Country}</div>

                        <div className={styles.barTrack}>
                            <motion.div
                                className={styles.bar}
                                animate={{ width: barWidth }}
                                initial={false}
                                style={{ backgroundColor: row.Color }}
                                transition={{
                                    duration: hasMoved
                                        ? Math.max(chartBarAnimSpeed - chartRowMoveAnimSpeed, 0.1)
                                        : chartBarAnimSpeed,
                                    delay: hasMoved ? chartRowMoveAnimSpeed : 0,
                                    ease: "linear",
                                }}
                            />
                        </div>

                        <div className={styles.populationCount}>
                            {row.PopulationLabel}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// Formats a number. E.g. 123456789 -> 123,456,789
// I know it's different from what I've seen in the GIF that showed the task to implement,
//  but I think it does look nicer and makes the number easier to read for users 
function toFormattedNumber(value: number) {
    return new Intl.NumberFormat().format(value)
}

// Prepares the data for the chart by copying the existing properties and adding new ones relative to the UI (e.g. associated color)
function toChartRow(country: Country): ChartRow {
    return {
        ...country,
        PopulationLabel: toFormattedNumber(country.Population),
        Color: getCountryColor(country.Country)
    };
}

function getCountryColor(country: string): string {
    // I needed a way to convert a Contry name to a number to associate a specific color
    // I looked online for a decent string to hash snippet.
    // There might be better ways (or more performant) but didn't want to spend too much time on this aspect and it seems to work well. 
    return palette[toHash(country) % palette.length];
}
export default function PopulationChart() {
    const [data, setData] = useState<PopulationData | null>(null);
    const [indexes, setIndexes] = useState({ current: 0, prev: null as number | null });
    const [isAutoplaying, setIsAutoplaying] = useState(true);
    const [countriesToDisplayCount, setCountriesToDisplayCount] = useState(15);
    const [isLoading, setLoading] = useState(true);

    // local functions
    function onSelectYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newIndex = Number(event.target.value);

        setIsAutoplaying(false);
        setIndexes(({ current }) => ({
            prev: current,
            current: newIndex
        }));
    }

    function onSelectCountriesToDisplayChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newDisplayCount = Number(event.target.value);
        setCountriesToDisplayCount(newDisplayCount);
    }

    function goToPreviousYear() {
        if (!data || data.length === 0) return;

        setIsAutoplaying(false);
        setIndexes(({ current }) => ({
            prev: current,
            current: current === 0 ? data.length - 1 : current - 1
        }));
    }

    function goToNextYear() {
        if (!data || data.length === 0) return;

        setIsAutoplaying(false);
        setIndexes(({ current }) => ({
            prev: current,
            current: (current + 1) % data.length
        }));
    }

    function toggleAutoplay() {
        setIsAutoplaying((value) => !value);
    }

    //////

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/population', { signal: controller.signal })
            .then((res) => res.json())
            .then((data: PopulationData) => {
                setData(data);
                setIndexes({
                    current: 0,
                    prev: null
                });
                setLoading(false);
            })
            .catch((error: unknown) => {
                if (error instanceof Error && error.name === 'AbortError') return;
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (!data || data.length === 0 || !isAutoplaying) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setIndexes(({ current }) => ({
                prev: current,
                current: (current + 1) % data.length
            }));
        }, goToNextYearInterval);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [data, isAutoplaying]);

    //////

    if (isLoading)
        return <p>Loading...</p>;

    if (!data || data.length === 0)
        return (
            <div className={styles.populationChartContainer}>
                <h1 className={styles.title}>World Population By Year</h1>
                <h2 className={styles.year}>Error - No population data available</h2>
            </div>
        )

    const chartData: CountriesYearlyData = data[indexes.current];
    const prevChartData: CountriesYearlyData | null = indexes.prev !== null ? data[indexes.prev] : null;

    const rows: ChartRow[] = chartData.Countries.map((item) => toChartRow(item));
    const prevRows: ChartRow[] | null = prevChartData ? prevChartData.Countries.map((item) => toChartRow(item)) : null;

    return (
        <div className={styles.populationChartContainer}>
            <h1 className={styles.title}>World Population By Year</h1>
            <h2 className={styles.year}>{chartData.Year}</h2>

            <div className={styles.controlsContainer}>
                <div className={styles.selectsContainer}>
                    <select
                        className={styles.select}
                        value={countriesToDisplayCount}
                        onChange={onSelectCountriesToDisplayChange}>
                        <option key={5} value={5}>Show 5 countries</option>
                        <option key={10} value={10}>Show 10 countries</option>
                        <option key={15} value={15}>Show 15 countries</option>
                        <option key={20} value={20}>Show 20 countries</option>
                        <option key={9999} value={9999}>All countries</option>
                    </select>

                    <select
                        className={styles.select}
                        value={indexes.current}
                        onChange={onSelectYearChange}>
                        {data.map((item, index) => (
                            <option key={item.Year} value={index}>
                                {item.Year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.buttonsContainer}>
                    <button type="button" onClick={goToPreviousYear} className={styles.button}>
                        Previous year
                    </button>

                    <button type="button" onClick={toggleAutoplay} className={styles.button}>
                        {isAutoplaying ? 'Pause autoplay' : 'Start autoplay'}
                    </button>

                    <button type="button" onClick={goToNextYear} className={styles.button}>
                        Next year
                    </button>
                </div>
            </div>

            <Chart
                data={rows}
                prevData={prevRows}
                countriesToDisplayCount={countriesToDisplayCount} />
        </div>
    );
}