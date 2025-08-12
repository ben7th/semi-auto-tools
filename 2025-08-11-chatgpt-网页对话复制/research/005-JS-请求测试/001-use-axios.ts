import axios from "axios"
import { API_URL, AUTH, USER_AGENT } from "./lib/consts"


const run = async () => {
  // console.log('url', url)
  // console.log('auth', auth)

  console.log('start')
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Host": "chatgpt.com",
        "Authorization": AUTH,
        "User-Agent": USER_AGENT
      },
      proxy: {
        host: "127.0.0.1",
        port: 7890,
        protocol: "http"
      },
    })

    console.log('response', response.status)
  } catch (error) {
    console.log('error', error)
  }
}

run()