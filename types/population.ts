export type PopulationData = CountriesYearlyData[]

export interface CountriesYearlyData {
  Year: number
  Countries: Country[]
}

export interface Country {
  _id: string
  Country: string
  Population: number
}
