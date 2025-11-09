<template>
  <div class="console-view">
    <div class="console-header">
      <h2>Soketi Console - {{ channel }}</h2>
      <div class="connection-status" :class="{ connected: isConnected }">
        {{ isConnected ? 'CONNECTED' : 'DISCONNECTED' }}
      </div>
    </div>
    <div class="console-output" ref="consoleOutput">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="timestamp">[{{ message.time }}]</span>
        <span class="event-type" :class="message.type.toLowerCase()">
          {{ message.type }}
        </span>
        <span class="message-content">{{ message.content }}</span>
      </div>
    </div>
    <div class="console-input">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="Type a message and press Enter..."
        :disabled="!isConnected"
        @keyup.enter="sendMessage"
      >
    </div>
  </div>
</template>

<script>
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export default {
  name: 'ConsoleView',
  data() {
    return {
      appKey: '',
      channel: '',
      inputMessage: '',
      messages: [],
      isConnected: false,
      echo: null
    };
  },
  created() {
    this.appKey = this.$route.query.appKey;
    this.channel = this.$route.query.channel;
    
    if (!this.appKey || !this.channel) {
      this.$router.push('/');
      return;
    }
    
    this.initializeEcho();
    this.addMessage('info', 'Connecting to Soketi...');
  },
  beforeDestroy() {
    if (this.echo) {
      this.echo.disconnect();
    }
  },
  methods: {
    initializeEcho() {
      try {
        this.echo = new Echo({
          broadcaster: 'pusher',
          key: this.appKey,
          wsHost: window.location.hostname,
          wsPort: 6001,
          forceTLS: false,
          disableStats: true,
          enabledTransports: ['ws', 'wss'],
        });

        // Connection status
        this.echo.connector.pusher.connection.bind('connected', () => {
          this.isConnected = true;
          this.addMessage('success', 'Connected to Soketi server');
          this.subscribeToChannel();
        });

        this.echo.connector.pusher.connection.bind('disconnected', () => {
          this.isConnected = false;
          this.addMessage('error', 'Disconnected from Soketi server');
        });

        this.echo.connector.pusher.connection.bind('error', (error) => {
          this.addMessage('error', `Connection error: ${error}`);
        });

      } catch (error) {
        this.addMessage('error', `Failed to initialize connection: ${error.message}`);
      }
    },
    
    subscribeToChannel() {
      try {
        this.echo.private(this.channel)
          .listen('.message', (data) => {
            this.addMessage('received', JSON.stringify(data, null, 2));
          })
          .listenForWhisper('typing', (e) => {
            this.addMessage('whisper', `User is typing: ${e.name}`);
          });
          
        this.addMessage('info', `Subscribed to channel: ${this.channel}`);
      } catch (error) {
        this.addMessage('error', `Failed to subscribe to channel: ${error.message}`);
      }
    },
    
    sendMessage() {
      if (!this.inputMessage.trim() || !this.isConnected) return;
      
      // In a real app, you would send this to your backend
      // which would then broadcast to the channel
      this.addMessage('sent', this.inputMessage);
      this.inputMessage = '';
    },
    
    addMessage(type, content) {
      const time = new Date().toLocaleTimeString();
      this.messages.push({ type, content, time });
      
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
}

.connection-status {
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.connection-status.connected {
  background-color: #006600;
  color: #00ff00;
}

.connection-status:not(.connected) {
  background-color: #660000;
  color: #ff5555;
}

.console-output {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.5;
}

.message {
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.timestamp {
  color: #666;
  margin-right: 0.5rem;
}

.event-type {
  font-weight: bold;
  margin-right: 0.5rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
}

.event-type.info {
  color: #00aaff;
  background-color: rgba(0, 170, 255, 0.1);
}

.event-type.success {
  color: #00ff00;
  background-color: rgba(0, 255, 0, 0.1);
}

.event-type.error {
  color: #ff5555;
  background-color: rgba(255, 0, 0, 0.1);
}

.event-type.received {
  color: #ffff55;
  background-color: rgba(255, 255, 0, 0.1);
}

.event-type.sent {
  color: #ff8800;
  background-color: rgba(255, 136, 0, 0.1);
}

.event-type.whisper {
  color: #aa00ff;
  background-color: rgba(170, 0, 255, 0.1);
}

.console-input {
  padding: 1rem;
  border-top: 1px solid #00ff00;
  background-color: #0a0a0a;
}

.console-input input {
  width: 100%;
  padding: 0.75rem;
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
}

.console-input input:focus {
  outline: none;
  border-color: #00cc00;
  box-shadow: 0 0 5px #00cc00;
}

.console-input input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar styling */
.console-output::-webkit-scrollbar {
  width: 8px;
}

.console-output::-webkit-scrollbar-track {
  background: #0a0a0a;
}

.console-output::-webkit-scrollbar-thumb {
  background: #00aa00;
  border-radius: 4px;
}

.console-output::-webkit-scrollbar-thumb:hover {
  background: #00cc00;
}
</style>
