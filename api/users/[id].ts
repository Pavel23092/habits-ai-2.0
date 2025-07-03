// Импортируем типы для Vercel и "мост" к Supabase
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Импортируем нашу "подсказку" из файла на уровень выше
import { Database } from '../types_db';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // !! ЗАМЕНИТЕ НА ВАШИ КЛЮЧИ !!
  const supabase = createClient<Database>(
    'https://uckqhcyjwxebvalgmrei.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3FoY3lqd3hlYnZhbGdtcmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTgyNzcsImV4cCI6MjA2Njk5NDI3N30.DhxDMjOxELF59fsDM9U44RIbnzEhIxXgt7iI1UEzA4M',
  );

  const { id } = request.query;

  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', Number(id)) // Убедимся, что ID это число
      .single();

    if (error) {
      // Это наша ошибка, если пользователя нет
      console.error('Ошибка от Supabase:', error.message);
      return response.status(404).json({ message: `Пользователь с ID ${id} не найден`, details: error.message });
    }
    
    return response.status(200).json(userData);

  } catch (e) {
    const error = e as Error;
    console.error('Непредвиденная ошибка:', error.message);
    return response.status(500).json({ message: 'Внутренняя ошибка сервера', details: error.message });
  }
}