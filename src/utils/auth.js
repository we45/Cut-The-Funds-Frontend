import axios from 'axios'
var api_url = process.env.API_URL || 'http://localhost:3000';
const instance = axios.create({
  baseURL: api_url,
  headers: {
    'Authorization': localStorage.getItem('token')
  }
})
export default instance
