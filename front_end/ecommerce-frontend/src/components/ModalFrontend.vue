<!-- <template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="close">X</button>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      close() {
        console.log('Close button clicked');
        this.$emit('update:visible', false);
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #333;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
   -->




   <template>
    <Teleport to="body">
      <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
          <button class="close-btn" @click="close">X</button>
          <slot></slot>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['update:visible']);
  
  const close = () => {
    console.log('Close button clicked');
    emit('update:visible', false);
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #333;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>