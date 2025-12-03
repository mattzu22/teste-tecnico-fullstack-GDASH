package models

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
	PrecipitationProbabilityPercent int     `json:"precipitation_probability_percent"`
}