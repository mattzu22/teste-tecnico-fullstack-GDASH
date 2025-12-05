package models

type HourlyForecast struct {
	Times                   []string  `json:"times"`
	PrecipitationProbability []float64 `json:"precipitation_probability"`
	Precipitation           []float64 `json:"precipitation"`
}

type WeatherData struct {
	City				 			string  `json:"city"`
	State              				string  `json:"state"`
	Country              			string  `json:"country"`
	Timestamp            			string  `json:"timestamp"`
	TemperatureCelsius   			float64 `json:"temperature_celsius"`
	HumidityPercent    	 			float64 `json:"humidity_percent"`
	WindSpeedMS          			float64 `json:"wind_speed_ms"`
	WindDirectionDegrees 			float64 `json:"wind_direction_degrees"`
	WeatherCode          			int     `json:"weather_code"`
	ApparentTemperature				float64 `json:"apparent_temperature"`
	PrecipitationProbabilityPercent float64 `json:"precipitation_probability_percent"`
	HourlyForecast                  HourlyForecast `json:"hourly_forecast"`
}
