<template>
  <div class="connection-view">
    <div class="connection-form">
      <h1>Connect to Soketi</h1>
      <div class="form-group">
        <label for="appKey">App Key:</label>
        <input 
          id="appKey" 
          v-model="appKey" 
          type="text" 
          placeholder="Enter your app key"
          @keyup.enter="connect"
        >
      </div>
      <div class="form-group">
        <label for="channel">Channel:</label>
        <input 
          id="channel" 
          v-model="channel" 
          type="text" 
          placeholder="Enter channel name"
          @keyup.enter="connect"
        >
      </div>
      <button @click="connect" :disabled="isConnecting">
        {{ isConnecting ? 'Connecting...' : 'Connect' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectionView',
  data() {
    return {
      appKey: '',
      channel: 'private-test-channel',
      isConnecting: false
    }
  },
  methods: {
    connect() {
      if (!this.appKey || !this.channel) {
        alert('Please fill in all fields');
        return;
      }
      
      this.isConnecting = true;
      this.$router.push({
        name: 'console',
        query: {
          appKey: this.appKey,
          channel: this.channel
        }
      });
    }
  }
}
</script>

<style scoped>
.connection-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
  color: #00ff00;
  font-family: 'Courier New', monospace;
}

.connection-form {
  background: #0a0a0a;
  padding: 2rem;
  border: 1px solid #00ff00;
  border-radius: 5px;
  width: 100%;
  max-width: 500px;
}

h1 {
  margin-top: 0;
  color: #00ff00;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  background: #1a1a1a;
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #00cc00;
  box-shadow: 0 0 5px #00cc00;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #006600;
  color: white;
  border: none;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #008800;
}

button:disabled {
  background: #003300;
  cursor: not-allowed;
}
</style>
