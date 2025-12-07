import { api } from '@/lib/api';
import type { GetInsightsProps } from '@/pages/Dashboard/components/features/InsightAI';
import { toast } from 'sonner';

interface insightsProps {
  title: string;
  description: string;
}

export const getInsights = async (): Promise<GetInsightsProps> => {
  try {
    const insights = await api.post('/insights');

    const { description, title }: insightsProps = insights.data;
    const status = insights.status;
    const message = insights.data.message;

    if (status === 201) {
      toast.success('Insight gerado.');
    }

    if (!insights.data) {
      toast.error('Sem dados atuais para gerar insights.');
    }

    return { status, message, description, title };
  } catch (error: Error | any) {
    if (error.response) {
      const message = error.response.data.message;

      toast.error(message);
    } else {
      toast.error('Não foi possível obter insights.');
    }

    return {
      status: 500,
      description: '',
      title: '',
      message: 'Erro desconhecido ao obter insights.',
    };
  }
};
