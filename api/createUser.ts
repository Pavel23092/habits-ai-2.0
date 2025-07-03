// Импортируем типы для Vercel и "мост" к Supabase
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Импортируем нашу "подсказку" для базы данных
import { Database } from './types_db';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Метод не разрешен' });
  }

  // !! ЗАМЕНИТЕ НА ВАШИ КЛЮЧИ !!
  const supabase = createClient<Database>(
    'https://uckqhcyjwxebvalgmrei.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3FoY3lqd3hlYnZhbGdtcmVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQxODI3NywiZXhwIjoyMDY2OTk0Mjc3fQ.eq7fcQ10Sxlv9Qj7NExKd8lfMDOBl_CugDjACZlX-mk',
  );

  try {
    const { telegram_id, username } = request.body;

    if (!telegram_id || !username) {
      return response.status(400).json({ message: 'Отсутствуют telegram_id или username' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ telegram_id, username })
      .select()
      .single();

    if (error) {
      // Это наша ошибка с RLS или дубликатом
      console.error('Ошибка от Supabase:', error.message);
      return response.status(409).json({ message: 'Ошибка при создании пользователя в БД', details: error.message });
    }
    
    return response.status(201).json({ message: 'Пользователь успешно создан!', user: data });

  } catch (e) {
    const error = e as Error;
    console.error('Непредвиденная ошибка:', error.message);
    return response.status(500).json({ message: 'Внутренняя ошибка сервера', details: error.message });
  }
}