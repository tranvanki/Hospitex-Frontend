<template>
  <div v-if="message" class="error-container" :class="{ 'with-icon': showIcon }">
    <div class="error-icon" v-if="showIcon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
      </svg>
    </div>
    <div class="error-content">
      <p class="error-message">{{ message }}</p>
      <button v-if="dismissible" @click="dismiss" class="dismiss-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    const dismiss = () => {
      emit('dismiss');
    };

    return {
      dismiss
    };
  }
}
</script>

<style scoped>
.error-container {
  display: flex;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 4px;
  padding: 12px 16px;
  margin: 8px 0;
  color: #B91C1C;
  align-items: center;
  width: 100%;
}

.with-icon {
  padding-left: 12px;
}

.error-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.error-message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.dismiss-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  color: #B91C1C;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.dismiss-button:hover {
  background-color: rgba(185, 28, 28, 0.1);
}
</style>