import { PopulationData } from "@/types/population";
import { NextResponse } from "next/server";

// Currently using real-world population data from https://datahub.io/core/population for smoother animations.
// To test with the original data provided as part of the test, comment line 7 and uncomment line 6.
//import populationData from '@/data/population-data.json';
import populationData from '@/data/population-data-alternate.json';

export async function GET(): Promise<NextResponse<PopulationData>> {
    try {
        return NextResponse.json(populationData, { status: 200 });
    } catch (error) {
        // TODO server side logging
        console.error(error);
        return NextResponse.json([], { status: 500, });
    }
}