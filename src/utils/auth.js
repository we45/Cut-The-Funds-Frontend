import axios from 'axios'
// var api_url = process.env.API_URL
import conf from '../../configure.json'
var api_url = conf.API_URL
const instance = axios.create({
  baseURL: api_url,
  headers: {
    'Authorization': localStorage.getItem('token')
  }
})
export default instance
