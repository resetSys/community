import axios from "axios"
export function request(config){
  let instence = new axios.create({
    baseURL:"http://192.168.1.215:8080/wisdom_factorys",
    timeout:10000,

  });
  return instence(config)
}