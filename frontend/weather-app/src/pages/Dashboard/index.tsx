// import { useState } from 'react';

import {
  Cloud,
  CloudRain,
  // MapPin,
  // RefreshCw,
  // Download,
  // ArrowRight,
  // Flower2,
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Header } from './components/layout/Header';
import { InsightAI } from './components/features/InsightAI';
import { DonwloadLogs } from './components/features/DonwloadLogs';
import { StatsSection } from './components/section/CardStats';
// import { Button } from '../components/ui/button';

export const WeatherDashboard = () => {
  // const [isRefreshing, setIsRefreshing] = useState(false);

  const temperatureData = [
    { time: 'Now', temp: 22 },
    { time: '1pm', temp: 23 },
    { time: '2pm', temp: 24 },
    { time: '3pm', temp: 25 },
    { time: '4pm', temp: 24 },
    { time: '5pm', temp: 23 },
    { time: '6pm', temp: 22 },
    { time: '7pm', temp: 21 },
    { time: '8pm', temp: 20 },
    { time: '9pm', temp: 19 },
    { time: '10pm', temp: 18 },
    { time: '11pm', temp: 18 },
    { time: '12am', temp: 17 },
  ];

  const rainData = [
    { time: 'Now', probability: 15 },
    { time: '3pm', probability: 8 },
    { time: '6pm', probability: 5 },
    { time: '9pm', probability: 25 },
    { time: '12am', probability: 30 },
  ];

  const historicalData = [
    {
      datetime: '2023-10-27 12:00',
      condition: 'Partly Cloudy',
      icon: <Cloud className="text-amber-400" size={20} />,
      temp: '24°C',
      humidity: '65%',
    },
    {
      datetime: '2023-10-27 09:00',
      condition: 'Light Rain',
      icon: <CloudRain className="text-sky-400" size={20} />,
      temp: '22°C',
      humidity: '72%',
    },
    {
      datetime: '2023-10-27 06:00',
      condition: 'Cloudy',
      icon: <Cloud className="text-slate-400" size={20} />,
      temp: '20°C',
      humidity: '80%',
    },
    {
      datetime: '2023-10-27 03:00',
      condition: 'Cloudy',
      icon: <Cloud className="text-slate-400" size={20} />,
      temp: '19°C',
      humidity: '85%',
    },
  ];

  // const handleRefresh = () => {
  //   setIsRefreshing(true);
  //   setTimeout(() => setIsRefreshing(false), 1000);
  // };

  // const handleDownload = () => {
  //   console.log('Downloading weather report...');
  // };

  const statsCard = [
    {
      title: 'Humidity',
      description: '65%',
    },
    {
      title: 'Wind Speed',
      description: '15 km/h',
    },
    {
      title: 'UV Index',
      description: 'High',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Main Weather Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="flex flex-col items-center text-center">
            <Cloud className="text-amber-400 mb-4" size={80} />
            <h2 className="text-7xl font-bold mb-2">24°C</h2>
            <p className="text-xl text-slate-300 mb-1">Partly Cloudy</p>
            <p className="text-slate-400">Feels like 26°C</p>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsSection stats={statsCard} />

        {/* AI Insight */}
        <InsightAI />

        {/* Charts */}
        <div className="flex flex-wrap gap-4">
          {/* Temperature Chart */}
          <div className="flex-1 min-w-[288px] bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">
                Hourly Temperature Forecast
              </p>
              <p className="text-4xl font-bold mb-1">22°C</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Next 24 hours</span>
                <span className="text-green-500 font-semibold">+2.1%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#tempGradient)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rain Probability Chart */}
          <div className="flex-1 min-w-[288px] bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">
                Rain Probability Forecast
              </p>
              <p className="text-4xl font-bold mb-1">15%</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Next 24 hours</span>
                <span className="text-red-500 font-semibold">-5.0%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={rainData}>
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar
                  dataKey="probability"
                  fill="#3b82f6"
                  opacity={0.3}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Data Table */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-xl font-bold">Historical Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">Temp</th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Humidity
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {historicalData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-700 ${index % 2 === 1 ? 'bg-slate-900/40' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.datetime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {row.icon}
                        <span>{row.condition}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{row.temp}</td>
                    <td className="px-6 py-4 text-right">{row.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Floating Action Button */}
      <DonwloadLogs />
    </div>
  );
};
