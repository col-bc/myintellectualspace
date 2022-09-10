<script setup>
import { reactive, onMounted } from 'vue'
import useUserStore from '../../stores/user'
import axios from 'axios'

const userStore = useUserStore()
const data = reactive({
  assessment: {
    name: '',
    description: '',
    questions: []
  }
})
const questionForm = reactive({
  question: '',
  answers: []
})
</script>
