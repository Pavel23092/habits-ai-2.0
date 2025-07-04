import { useState } from 'react';
import axios from 'axios';

// Объявляем типы шагов онбординга
type OnboardingStep = 
  | 'start' 
  | 'what_habit' 
  | 'identity_select' 
  | 'success_display'
  | 'error_display'; 

function App() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('start');
  const [userInput, setUserInput] = useState({
    goal: '',
    // ... остальные поля по мере добавления шагов
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [responseDetails, setResponseDetails] = useState('');

  const handleNextStep = async () => {
    // В будущем здесь будет AI-логика и API-вызовы
    // Пока просто для демонстрации работы UI:
    if (currentStep === 'start') {
      setCurrentStep('what_habit');
    } else if (currentStep === 'what_habit') {
      // Имитируем вызов бэкенда для создания пользователя (для теста связки)
      try {
        const tempTelegramId = Math.floor(Math.random() * 1000000000);
        const tempUsername = `User_${tempTelegramId}`;
        
        // ВАЖНО: Если ваш бэкенд на vercel.app, здесь будет его URL
        // Например: 'https://ваш-backend-проект.vercel.app/api/createUser'
        // Для локального теста - http://localhost:3000
        const backendUrl = 'https://habits-ai-20-15s894u4d-pavel23092s-projects.vercel.app'; // Используем локальный для теста

        const response = await axios.post(`${backendUrl}/api/createUser`, {
          telegram_id: tempTelegramId,
          username: tempUsername,
        });
        
        setResponseMessage(`Пользователь создан: ${response.data.user.username}`);
        setResponseDetails(JSON.stringify(response.data.user, null, 2));
        setCurrentStep('success_display'); // Переход к экрану успеха
        
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setResponseMessage('Ошибка создания пользователя:');
          setResponseDetails(JSON.stringify(error.response.data, null, 2));
        } else {
          setResponseMessage('Произошла неизвестная ошибка');
          setResponseDetails('');
        }
        setCurrentStep('error_display'); // Переход к экрану ошибки
      }
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'start':
        return (
          <>
            <h2>Добро пожаловать в Habits AI!</h2>
            <p>Мы поможем вам стать той версией себя, которой вы хотите быть.</p>
            <button onClick={handleNextStep}>Начать Трансформацию</button>
          </>
        );
      case 'what_habit':
        return (
          <>
            <h2>Какова ваша главная цель?</h2>
            <p>Опишите своими словами, что вы хотите изменить.</p>
            <textarea
              value={userInput.goal}
              onChange={(e) => setUserInput({ ...userInput, goal: e.target.value })}
              placeholder="Например: стать продуктивнее"
              rows={4}
              style={{ width: '80%', padding: '10px' }} // Самые базовые стили
            />
            <button onClick={handleNextStep}>Продолжить</button>
          </>
        );
      case 'success_display':
        return (
          <>
            <h2>{responseMessage}</h2>
            <pre style={{ backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>{responseDetails}</pre>
            <button onClick={() => setCurrentStep('start')}>Начать заново</button>
          </>
        );
      case 'error_display':
        return (
          <>
            <h2>{responseMessage}</h2>
            <pre style={{ backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '5px', overflowX: 'auto', color: 'red' }}>{responseDetails}</pre>
            <button onClick={() => setCurrentStep('start')}>Начать заново</button>
          </>
        );
      default:
        return <h2>Загрузка...</h2>;
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {renderContent()}
    </div>
  );
}

export default App;