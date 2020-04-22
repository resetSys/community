import axios from "axios"
export function request(config){
  let instence = new axios.create({
    baseURL:"http://192.168.1.215",
    //http://192.168.1.215/staff/select
    // baseURL:"./",
    timeout:20000,

  });
  return instence(config)
}