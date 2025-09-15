<template>
  <div class="empty-state">
    <div class="empty-state-icon" v-if="showIcon">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M20 6H4V8H20V6ZM18.5 11H5.5C4.67 11 4 11.67 4 12.5V17.5C4 18.33 4.67 19 5.5 19H18.5C19.33 19 20 18.33 20 17.5V12.5C20 11.67 19.33 11 18.5 11ZM18 17H6V13H18V17ZM3 2H21V4H3V2Z" />
        </svg>
      </slot>
    </div>
    
    <h3 class="empty-state-title">{{ title }}</h3>
    
    <p v-if="description" class="empty-state-description">{{ description }}</p>
    
    <div v-if="$slots.default" class="empty-state-content">
      <slot></slot>
    </div>
    
    <div class="empty-state-actions" v-if="actionText">
      <router-link v-if="actionLink" :to="actionLink" class="action-button">
        {{ actionText }}
      </router-link>
      <button v-else @click="handleAction" class="action-button">
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    actionText: {
      type: String,
      default: ''
    },
    actionLink: {
      type: [String, Object],
      default: null
    }
  },
  emits: ['action'],
  setup(props, { emit }) {
    const handleAction = () => {
      emit('action');
    };

    return {
      handleAction
    };
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
  margin: 1rem 0;
  min-height: 250px;
}

.empty-state-icon {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state-description {
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 28rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.empty-state-content {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 28rem;
}

.empty-state-actions {
  margin-top: 0.5rem;
}

.action-button {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #2563eb;
}

.action-button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>