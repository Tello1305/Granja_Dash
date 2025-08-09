import { useState } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { testGeminiConnection, chatWithAI, getSuggestedQuestions } from '../services/geminiService';
import '../assets/css/notifications.css';

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' o 'chat'
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    const {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        refreshNotifications,
        dashboardData
    } = useNotificationContext();

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return 'bi-exclamation-triangle-fill';
            case 'medium': return 'bi-info-circle-fill';
            case 'low': return 'bi-check-circle-fill';
            default: return 'bi-bell-fill';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'summary': return 'bi-graph-up';
            case 'alert': return 'bi-exclamation-triangle';
            case 'info': return 'bi-info-circle';
            case 'success': return 'bi-check-circle';
            case 'error': return 'bi-x-circle';
            default: return 'bi-bell';
        }
    };

    // Funciones para el chat
    const handleChatSubmit = async (question = chatInput) => {
        if (!question.trim()) return;

        console.log('Enviando pregunta:', question);

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: question,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            console.log('Llamando a chatWithAI...');
            const aiResponse = await chatWithAI(question, dashboardData);
            console.log('Respuesta recibida:', aiResponse);
            
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                message: aiResponse,
                timestamp: new Date()
            };

            setChatHistory(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error en handleChatSubmit:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                message: 'Error de conexión. Verifica tu API key de Gemini y tu conexión a internet.',
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleSuggestedQuestion = (question) => {
        handleChatSubmit(question);
    };

    const clearChat = () => {
        setChatHistory([]);
    };

    return (
        <div className="notification-center">
            <button 
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Notificaciones"
            >
                <i className="bi bi-bell"></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
                {isLoading && (
                    <div className="loading-indicator"></div>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <div className="notification-tabs">
                            <button 
                                className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <i className="bi bi-bell"></i>
                                Notificaciones
                                {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveTab('chat')}
                            >
                                <i className="bi bi-chat-dots"></i>
                                Consultar IA
                            </button>
                        </div>
                        <div className="notification-actions">
                            {activeTab === 'notifications' && (
                                <>
                                    <button 
                                        onClick={refreshNotifications}
                                        className="btn-action"
                                        title="Recargar notificaciones del sistema"
                                        disabled={isLoading}
                                    >
                                        <i className={`bi ${isLoading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'}`}></i>
                                    </button>
                                    <button 
                                        onClick={markAllAsRead}
                                        className="btn-action"
                                        title="Marcar todas como leídas"
                                    >
                                        <i className="bi bi-check2-all"></i>
                                    </button>
                                    <button 
                                        onClick={clearNotifications}
                                        className="btn-action"
                                        title="Limpiar todas"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </>
                            )}
                            {activeTab === 'chat' && (
                                <button 
                                    onClick={clearChat}
                                    className="btn-action"
                                    title="Limpiar chat"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="btn-action"
                                title="Cerrar"
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    </div>

                    {activeTab === 'notifications' && (
                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <div className="no-notifications">
                                    <i className="bi bi-bell-slash"></i>
                                    <p>No hay notificaciones</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id}
                                        className={`notification-item ${!notification.read ? 'unread' : ''} priority-${notification.priority}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="notification-icon">
                                            <i className={`bi ${getTypeIcon(notification.type)}`}></i>
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-title">
                                                {notification.title}
                                                <span className="notification-time">
                                                    {formatTime(notification.timestamp)}
                                                </span>
                                            </div>
                                            <div className="notification-message">
                                                {notification.message}
                                            </div>
                                        </div>
                                        <div className="notification-priority">
                                            <i className={`bi ${getPriorityIcon(notification.priority)}`}></i>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="chat-container">
                            <div className="chat-messages">
                                {chatHistory.length === 0 ? (
                                    <div className="chat-welcome">
                                        <div className="welcome-icon">
                                            <i className="bi bi-robot"></i>
                                        </div>
                                        <h4>¡Hola! Soy tu asistente de granja</h4>
                                        <p>Puedo ayudarte con preguntas sobre tu sistema de gestión avícola</p>
                                        <div className="chat-mode-indicator">
                                            <i className="bi bi-robot"></i>
                                            <span>Modo: IA + Respuestas Predefinidas</span>
                                        </div>
                                        
                                        <div className="suggested-questions">
                                            <p className="suggestions-title">Preguntas sugeridas:</p>
                                            {getSuggestedQuestions(dashboardData).map((question, index) => (
                                                <button
                                                    key={index}
                                                    className="suggestion-btn"
                                                    onClick={() => handleSuggestedQuestion(question)}
                                                >
                                                    {question}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    chatHistory.map(message => (
                                        <div 
                                            key={message.id}
                                            className={`chat-message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
                                        >
                                            <div className="message-avatar">
                                                <i className={`bi ${message.type === 'user' ? 'bi-person-fill' : 'bi-robot'}`}></i>
                                            </div>
                                            <div className="message-content">
                                                <div className="message-text">{message.message}</div>
                                                <div className="message-time">
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                                {isChatLoading && (
                                    <div className="chat-message ai-message">
                                        <div className="message-avatar">
                                            <i className="bi bi-robot"></i>
                                        </div>
                                        <div className="message-content">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="chat-input-container">
                                <div className="chat-input-wrapper">
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder="Pregúntame sobre tu granja..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                                        disabled={isChatLoading}
                                    />
                                    <button
                                        className="chat-send-btn"
                                        onClick={() => handleChatSubmit()}
                                        disabled={isChatLoading || !chatInput.trim()}
                                    >
                                        <i className="bi bi-send"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}