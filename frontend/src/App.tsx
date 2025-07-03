import { useState } from 'react';
import axios from 'axios';

// Наша главная "база данных" для AI и пользовательских взаимодействий
// Используем тип 'string' пока не создадим более сложную логику
type OnboardingStep = 
  | 'start' 
  | 'what_habit' 
  | 'identity_select' 
  | 'rule_2_minutes' 
  | 'trigger_select' 
  | 'summary'
  | 'error'; // Добавили состояние для ошибок

function App() {
  // Состояние для текущего шага онбординга. Начинаем с 'start'.
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('start');
  // Состояние для хранения того, что пользователь ввел в полях
  const [userInput, setUserInput] = useState({
    goal: '',
    habitName: '',
    identity: '',
    twoMinuteRule: '',
    triggerType: '',
    triggerValue: '',
  });

  // ************ AI related state for dynamic onboarding (Placeholder for now) ************
  // В будущем здесь будет генерироваться ИИ, но пока это вручную
  const [aiGeneratedIdentity, setAiGeneratedIdentity] = useState(''); 
  const [aiGeneratedHabit, setAiGeneratedHabit] = useState('');


  // ************ Функция для обработки отправки формы ************
  const handleSubmit = async () => {
    // Здесь пока просто переходим к следующему шагу
    switch (currentStep) {
      case 'start':
        setCurrentStep('what_habit');
        break;
      case 'what_habit':
        if (userInput.goal.trim() === '') {
          // Если цель пуста, показываем ошибку
          alert('Пожалуйста, опишите вашу цель!');
          return;
        }
        // В будущем здесь будет вызов AI: generateIdentityAndFirstHabit(userInput.goal)
        setAiGeneratedIdentity(`Сосредоточенный ${userInput.goal}`); // Placeholder AI
        setAiGeneratedHabit(`Сделать что-то маленькое по "${userInput.goal}"`); // Placeholder AI
        setCurrentStep('identity_select'); // Предположим, AI выдал идентичность и привычку
        break;
      // ... другие шаги будут добавлены позже
      default:
        break;
    }
  };

  // ************ UI для разных шагов онбординга ************
  const renderStep = () => {
    switch (currentStep) {
      case 'start':
        return (
          <div style={styles.container}>
            <h2 style={styles.title}>Добро пожаловать в Habits AI!</h2>
            <p style={styles.description}>
              Мы поможем вам стать той версией себя, которой вы хотите быть.
            </p>
            <button style={styles.button} onClick={() => setCurrentStep('what_habit')}>
              Начать Трансформацию
            </button>
          </div>
        );

      case 'what_habit':
        return (
          <div style={styles.container}>
            <h2 style={styles.title}>Какова ваша главная цель?</h2>
            <p style={styles.description}>
              Опишите своими словами, что вы хотите изменить или кем хотите стать.
            </p>
            <textarea
              style={styles.textArea}
              value={userInput.goal}
              onChange={(e) => setUserInput({ ...userInput, goal: e.target.value })}
              placeholder="Например: Я хочу стать продуктивнее / Я хочу стать здоровее..."
              rows={4}
            />
            <button style={styles.button} onClick={handleSubmit}>
              Продолжить
            </button>
          </div>
        );
      
      // ... Остальные шаги будут добавлены здесь позже
      case 'identity_select':
        return (
          <div style={styles.container}>
            <h2 style={styles.title}>
              Отлично! Кажется, вы хотите стать: <br />"{aiGeneratedIdentity}"
            </h2>
            <p style={styles.description}>
              И ваша первая атомная привычка: <br />"{aiGeneratedHabit}"
            </p>
            <button style={styles.button} onClick={() => setCurrentStep('summary')}>
              Подтвердить
            </button>
          </div>
        );

      default:
        return (
          <div style={styles.container}>
            <h2>Неизвестный шаг онбординга.</h2>
            <button style={styles.button} onClick={() => setCurrentStep('start')}>
              Начать заново
            </button>
          </div>
        );
    }
  };

  // ************ Основной рендер компонента App ************
  return (
    <div style={styles.appContainer}>
      {renderStep()}
    </div>
  );
}

// Простейшие стили для MVP
const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '15px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '25px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 25px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  textArea: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    resize: 'vertical',
  }
};

export default App;