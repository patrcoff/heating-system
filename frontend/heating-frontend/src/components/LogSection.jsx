import React, {useEffect, useState} from 'react'

const server = "http://192.168.1.177"
const port = "8000"
const baseurl = server + ":" + port

function LogSection() {

  const [Logs, setLogs] = useState([])
  
  function refreshLogs() {
    fetch(baseurl + "/api/log")
    .then((response) => response.json())
    .then((data) => {setLogs(data)});
    console.log(Logs)
  }

  useEffect(() => {
    //refreshData()
    //refreshProfiles()
    refreshLogs()
  },[])

  return (
    
    <ul className="text-center">
        {Logs.filter(log => log.source_id == "heating-script").map(x => <li key={x.id}>{x.temperature}</li>)}
    </ul>

  )
}

export default LogSection