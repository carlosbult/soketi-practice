<template>
    <div class="console-view">
        <div class="console-header">
            <h2>Soketi Console - charge.updated</h2>
            <div class="connection-status" :class="{ connected: isConnected }">
                {{ isConnected ? 'CONNECTED' : 'CONNECTING...' }}
            </div>
        </div>
        <div class="console-controls">
            <button @click="disconnect" :disabled="!isConnected">Disconnect</button>
            <button @click="clearMessages" class="clear-btn">Clear Console</button>
        </div>
        <div class="console-output" ref="consoleOutput">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <span class="timestamp">[{{ message.time }}]</span>
                <span class="event-type" :class="message.type.toLowerCase()">
                    {{ message.type }}
                </span>
                <pre class="message-content" v-if="message.content">{{ formatMessageContent(message.content) }}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import { Echo } from '@/config/echo';

export default {
    name: 'ConsoleView',
    data() {
        return {
            messages: [],
            isConnected: false,
            echo: null,
            channelName: 'stripe.charges',
            eventName: 'charge.succeeded',
            subscription: null
        };
    },
    created() {
        this.initializeEcho();
    },
    beforeDestroy() {
        this.disconnect();
    },
    methods: {
        initializeEcho() {
            try {
                this.addMessage('info', 'Connecting to Soketi server...');

                // Listen for connection state changes
                window.Echo.connector.pusher.connection.bind('connected', () => {
                    this.isConnected = true;
                    this.addMessage('success', 'Connected to Soketi server');
                    this.subscribeToChannel();
                });

                window.Echo.connector.pusher.connection.bind('disconnected', () => {
                    this.isConnected = false;
                    this.addMessage('error', 'Disconnected from Soketi server');
                });

                window.Echo.connector.pusher.connection.bind('error', (error) => {
                    this.addMessage('error', `Connection error: ${error}`);
                });

                // If already connected, subscribe immediately
                if (window.Echo.connector.pusher.connection.state === 'connected') {
                    this.isConnected = true;
                    this.addMessage('success', 'Using existing Soketi connection');
                    this.subscribeToChannel();
                }
            } catch (error) {
                this.addMessage('error', `Failed to initialize connection: ${error.message}`);
            }
        },

        subscribeToChannel() {
            try {
                console.log('Suscribiéndose al canal:', this.channelName);
                this.addMessage('info', `Suscribiéndose al canal: ${this.channelName}`);

                // Suscribirse al canal para los eventos de pago
                const coneectino = (this.subscription = window.Echo.channel(this.channelName).listen('stripe.charges', (data) => {
                    console.log('Evento recibido:', data);
                    this.addMessage('received', {
                        name: 'stripe.charges',
                        data: data,
                        channels: [this.channelName]
                    });
                }));
                // console.log('Suscripción exitosa al canal:', coneectino);

                this.addMessage('success', `Suscripción exitosa al canal: ${this.channelName}`);
                this.addMessage('info', 'Esperando eventos de pago...');
            } catch (error) {
                this.addMessage('error', `Failed to subscribe to channel: ${error.message}`);
            }
        },

        disconnect() {
            if (this.subscription) {
                try {
                    this.subscription.stopListening(this.eventName);
                    this.subscription = null;
                    this.addMessage('info', 'Unsubscribed from channel');
                } catch (error) {
                    this.addMessage('error', `Error unsubscribing: ${error.message}`);
                }
            }

            if (window.Echo) {
                try {
                    window.Echo.disconnect();
                    this.isConnected = false;
                    this.addMessage('info', 'Disconnected from Soketi');
                } catch (error) {
                    this.addMessage('error', `Error disconnecting: ${error.message}`);
                }
            }
        },

        clearMessages() {
            this.messages = [];
            this.addMessage('info', 'Console cleared');
        },

        formatMessageContent(content) {
            try {
                // console.log('Contenido del mensaje:', content); // Mantener para debugging

                // 1. Si content.data existe y el nombre coincide, procesar el pago.
                if (content && content.name === 'stripe.charges' && content.data) {
                    let payment;
                    try {
                        // 2. Intentar parsear si es un string (el formato de Soketi es a veces inconsistente)
                        payment = typeof content.data === 'string' ? JSON.parse(content.data) : content.data; // Si ya es objeto, usarlo directamente
                    } catch (e) {
                        console.error('Error parsing payment data:', e);
                        return `Error procesando datos de pago: ${e.message}`;
                    }

                    // --- El resto de tu lógica de formateo de pago es correcta: ---
                    const billing = payment.billing_details || {};
                    const shipping = payment.shipping || {};
                    const shippingAddress = shipping.address || {};

                    return `
💳 Pago Procesado (${payment.status.toUpperCase()})
--------------------------------
// ... (El resto del template de formateo está correcto)
            `;
                }

                // 3. Si no es un mensaje de pago formateado, mostrar el JSON.
                // Si content ya es un objeto, intenta stringify. Si es un string simple, devolverlo.
                return typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
            } catch (e) {
                console.error('Error formatting message:', e);
                return 'Error formateando el mensaje: ' + e.message;
            }
        },

        addMessage(type, content) {
            const time = new Date().toLocaleTimeString();
            this.messages.push({ type, content, time });

            // Keep only the last 1000 messages to prevent memory issues
            if (this.messages.length > 1000) {
                this.messages.shift();
            }

            // Auto-scroll to bottom
            this.$nextTick(() => {
                const container = this.$refs.consoleOutput;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    }
};
</script>

<style scoped>
.console-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #1a1a1a;
    color: #00ff00;
    font-family: 'Courier New', monospace;
}

.console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #0a0a0a;
    border-bottom: 1px solid #00ff00;
    position: sticky;
    top: 0;
    z-index: 10;
}

.console-controls {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #0f0f0f;
    border-bottom: 1px solid #1a1a1a;
}

.console-controls button {
    background: linear-gradient(145deg, #2d3748, #1a202c);
    color: #e2e8f0;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.25s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
}

.console-controls button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    background: linear-gradient(145deg, #3c4a68, #2d3748);
}

.console-controls button:active:not(:disabled) {
    transform: translateY(0);
}

.console-controls button:disabled {
    background: #4a5568;
    color: #a0aec0;
    cursor: not-allowed;
    opacity: 0.7;
}

.clear-btn {
    background: linear-gradient(145deg, #4a1d96, #6b46c1) !important;
    color: white !important;
}

.clear-btn:hover:not(:disabled) {
    background: linear-gradient(145deg, #6b46c1, #805ad5) !important;
}

.console-output {
    flex: 1;
    overflow-y: auto;
    background-color: #0f172a;
    padding: 20px;
    border-radius: 8px;
    font-family: 'Fira Code', 'Courier New', monospace;
    white-space: pre-wrap;
    border: 1px solid #2d3748;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.message {
    margin-bottom: 15px;
    padding: 15px;
    border-left: 4px solid #4a5568;
    background-color: #1e293b;
    border-radius: 0 8px 8px 0;
    transition: all 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.timestamp {
    color: #94a3b8;
    margin-right: 12px;
    font-size: 0.8rem;
    font-family: 'Fira Code', monospace;
    letter-spacing: 0.5px;
}

.event-type {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 12px;
    margin-right: 10px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.event-type.received {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border-left: 2px solid #60a5fa;
}

.event-type.info {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
    border-left: 2px solid #9ca3af;
}

.event-type.success {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-left: 2px solid #34d399;
}

.event-type.error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border-left: 2px solid #f87171;
}

.message-content {
    margin: 12px 0 0 0;
    padding: 15px;
    background-color: #0f172a;
    border: 1px solid #2d3748;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Fira Code', 'Courier New', monospace;
    color: #e2e8f0;
    line-height: 1.6;
    font-size: 0.95rem;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Estilo para los mensajes de pago */
.message-content {
    background-color: #1e1b4b;
    border-left: 4px solid #7c3aed;
}

/* Scrollbar styling */
.console-output::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.console-output::-webkit-scrollbar-track {
    background: #1e293b;
    border-radius: 4px;
}

.console-output::-webkit-scrollbar-thumb {
    background: #4a5568;
    border-radius: 4px;
    border: 2px solid #1e293b;
}

.console-output::-webkit-scrollbar-thumb:hover {
    background: #718096;
}

/* Animación para nuevos mensajes */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message {
    animation: fadeIn 0.3s ease-out;
}

/* Responsive design */
@media (max-width: 992px) {
    .console-view {
        padding: 15px;
        height: 95vh;
        max-width: 100%;
        border-radius: 0;
    }

    .console-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 15px;
    }

    .connection-status {
        margin: 0;
        align-self: flex-start;
    }

    .console-controls {
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }

    .console-controls button {
        padding: 8px 15px;
        font-size: 0.85rem;
        flex: 1 1 calc(50% - 10px);
        justify-content: center;
    }

    .console-output {
        padding: 12px;
    }

    .message {
        padding: 12px;
    }

    .message-content {
        padding: 12px;
        font-size: 0.9rem;
    }
}

/* Tipografía mejorada */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&display=swap');

.console-view {
    font-family: 'Inter', sans-serif;
}

.console-header h2 {
    font-family: 'Inter', sans-serif;
}

.message-content,
.timestamp {
    font-family: 'Fira Code', 'Courier New', monospace;
}

/* Mejoras de accesibilidad */
:focus-visible {
    outline: 2px solid #4cc9f0;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Efecto de brillo en el encabezado */
.console-header::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76, 201, 240, 0.4), transparent);
}
</style>
