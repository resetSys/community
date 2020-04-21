import axios from "axios"
export function request(config){
  let instence = new axios.create({
<<<<<<< HEAD
    baseURL:"http://192.168.1.215",
    //http://192.168.1.215/staff/select
    // baseURL:"./",
=======
    // baseURL:"http://192.168.1.215:8080/wisdom_factorys",
    baseURL:"./",
>>>>>>> d257f525556218105bcbebf7225636906a12e383
    timeout:20000,

  });
  return instence(config)
}