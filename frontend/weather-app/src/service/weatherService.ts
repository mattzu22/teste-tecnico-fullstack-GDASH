import type { WeatherData } from '@/interfaces/Weather';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export async function getWeatherLogs(): Promise<
  { status: number; weatherLogs: WeatherData[] } | undefined
> {
  try {
    const data = await api.get('/api/weather/logs');

    const status = data.status;
    const weatherLogs = data.data;

    if (!data) {
      toast.error('Error ao bsucar logs meterologicos');
    }

    return { status, weatherLogs };
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;
      toast.error(message);
      return { status: error.response.status, weatherLogs: [] };
    }
    toast.error('Erro desconhecido ao buscar logs.');
    return undefined;
  }
}

export async function downloadWeatherLogsCSV(): Promise<void> {
  try {
    const response = await api.get('/api/weather/export/csv', {
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'];
    let fileName = 'weather-logs.csv';

    if (disposition) {
      const fileNameMatch = disposition.match(/filename="?(.+)"?/);
      if (fileNameMatch?.[1]) {
        fileName = fileNameMatch[1];
      }
    }

    const blob = new Blob([response.data], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Arquivo baixado!');
  } catch (error: Error | any) {
    if (error.response?.status === 404) {
      toast.error('Nenhum dado disponível');
    } else {
      toast.error('Erro ao baixar arquivo');
    }
  }
}

export async function downloadWeatherLogsXLSX(): Promise<void> {
  try {
    const response = await api.get('/api/weather/export/xlsx', {
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'];
    let fileName = 'weather-logs.xlsx';

    if (disposition) {
      const fileNameMatch = disposition.match(/filename="?(.+)"?/);
      if (fileNameMatch?.[1]) {
        fileName = fileNameMatch[1];
      }
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    toast.success('Arquivo baixado!');
  } catch (error: any) {
    if (error?.response?.status === 404) {
      toast.error('Nenhum dado disponível.');
    } else {
      toast.error('Erro ao baixar o arquivo.');
    }
  }
}
