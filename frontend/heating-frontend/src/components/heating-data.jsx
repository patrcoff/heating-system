import React, {useEffect, useState} from 'react'






//need to rename this as this is now bigger than just the times (in fact we're yet to fully implement current times lol)
const CurrentTimes = () => {
    const [CurrentData, setData] = useState({current:{boost:"2023-02-20T14:03:27.054272"},profile:{times:[{id:1,current_time:'no time Toulouse'}]}});
    //const [CurrentProfile, setProfile] = useState([])
    //const [CurrentBoost, setBoost] = useState([])
    const [Profiles, setProfiles] = useState([])
    
    function refreshData() {
        fetch("http://192.168.1.177:8000/")
            .then((response) => response.json())
            .then((data) => {setData(data)});
    }

    function refreshProfiles() {
        fetch("http://192.168.1.177:8000/profiles")
            .then((response) => response.json())
            .then((data) => {setProfiles(data.profiles);});        
    }

    async function toggleBoost() {
        //set the currently selected heating controller profile of the API where x is the profile id
        let address = "http://192.168.1.177:8000/boost"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        //console.log(address)
        const res = await fetch(address,requestOptions) //  here await tells the async func to wait for this step to complete before continueing
        //this is necessary because fetch is an async func itself and so will run in parallel to the rest of the statements within this function if not told to wait
        //console.log(res.status)
        
        if (res.status == 200) {
            refreshData()  // because now it would be out of sync
        } else {
            console.log("Error: API request response is: " + res.status.toString())
        }
        //console.log(typeof(x))
        //console.log(x)
    }


/* notes for times
    timeStr = time.getHours().toString().padStart(2,0) + ":" + time.getMinutes().toString().padStart(2,0)
    the above will output a string of the Date object 'time' in the format hh:mm

    to get the actual Date object you do:

    const time = new Date();

      //then set its time parts

    time.setHours(h)
    time.setMinutes(m)


*/

    useEffect(() => {
        refreshData()
        refreshProfiles()
    },[])

    async function increaseDayTemp(x,direction,day) {
        //set the currently selected heating controller profile of the API where x is the profile id
        //where direction is -1 for decrease, 1 for increase, and day is -1 for night_temp and 1 for day_temp
        let address = "http://192.168.1.177:8000/profile/" + x.current.profile_id.toString()
        let temp
        let data
        if (day > 0) {
            temp =  x.profile.day_temp + (direction * 0.5)
            data = {day_temp: temp}
        } else {
            temp =  x.profile.night_temp + (direction * 0.5)
            data = {night_temp:temp}
        }
        //if (direction > 0) {temp += 0.5} else {temp -= 0.5}
        console.log(temp)
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        //console.log(address)
        const res = await fetch(address,requestOptions) //  here await tells the async func to wait for this step to complete before continueing
        //this is necessary because fetch is an async func itself and so will run in parallel to the rest of the statements within this function if not told to wait
        //console.log(res.status)
        
        if (res.status == 200) {
            refreshData()  // because now it would be out of sync
        } else {
            console.log("Error: API request response is: " + res.status.toString())
        }
        //console.log(typeof(x))
        //console.log(x)
    }

    useEffect(() => {
        refreshData()
        refreshProfiles()
    },[])

    async function setCurrentProfile(x) {
        //set the currently selected heating controller profile of the API where x is the profile id
        let address = "http://192.168.1.177:8000/current/profile/" + x.toString()
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };
        //console.log(address)
        const res = await fetch(address,requestOptions) //  here await tells the async func to wait for this step to complete before continueing
        //this is necessary because fetch is an async func itself and so will run in parallel to the rest of the statements within this function if not told to wait
        //console.log(res.status)
        
        if (res.status == 200) {
            refreshData()
        } else {
            console.log("Error: API request response is: " + res.status.toString())
        }
        //console.log(typeof(x))
        //console.log(x)
    }

    async function setTimeRange(i,time, type) {
        //set the currently selected heating controller profile of the API where x is the profile id
        let address = "http://192.168.1.177:8000/times/" + i.toString()
        //console.log(address)
        let data
        if (type == "start") {
            data = {start_time: time}
            //console.log(time)
        }
        else if (type == "end") {
            data = {end_time: time}
            //console.log(time)
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        //console.log(requestOptions.body)
        //console.log(address)
        const res = await fetch(address,requestOptions) //  here await tells the async func to wait for this step to complete before continueing
        //this is necessary because fetch is an async func itself and so will run in parallel to the rest of the statements within this function if not told to wait
        //console.log(res.status)
        
        if (res.status == 200) {
            refreshData()
        } else {
            console.log("Error: API request response is: " + res.status.toString())
        }
        //console.log(typeof(x))
        //console.log(x)
    }

    const ProfileButton = ({x}) => {
        //let id = x.id
        return (
            <button onClick = {() => setCurrentProfile(x.id)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    {x.name}
                </span>
                
            </button>
        )
      }
    

    const handleKeyDown = (x,time_type,e) => {
        if (e.key === 'Enter') {
            //setUpdated(event.target.value);
            //console.log(e.target.value)
            //console.log(x)
            //console.log(time_type)
            setTimeRange(x,e.target.value,time_type)
          }
        };        
    
    const TimeInput = ({x,time_type}) => {
        return (<input type="time"  onKeyDown =  {(e) => handleKeyDown(x.id,time_type,e)}></input>)    
    }

//function for profile select button
//api put to change current profile to id of selected profile
//refresh heating data section (not the profiles section)

    return (

        <div className="justify-evenly">
            <div className = "">
            <h2 className="text-red-500 text-3xl">Heating Data</h2>
            <br></br>
            </div>
            <div className="">
            <p>Profile: {JSON.stringify(CurrentData.profile.name)}</p>
            <br></br>
            <button onClick = {toggleBoost} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    BOOST
                </span>
            </button>
            <hr/>
            <hr/>
            <p className={Date.parse(CurrentData.current.boost) < Date.now() ? "hidden" : "text-green-500"}>Boost until: {JSON.stringify(CurrentData.current.boost.split("T")[1].split(".")[0].slice(0,5))}</p>

            <br></br>

            <p>Day Temp: {JSON.stringify(CurrentData.profile.day_temp)}</p> 
            <button onClick = {() => increaseDayTemp(CurrentData,-1,1)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    -
                </span>
            </button>
            <button onClick = {() => increaseDayTemp(CurrentData,1,1)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    +
                </span>
            </button>
            <p>Night Temp: {JSON.stringify(CurrentData.profile.night_temp)}</p>
            <button onClick = {() => increaseDayTemp(CurrentData,-1,-1)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    -
                </span>
            </button>
            <button onClick = {() => increaseDayTemp(CurrentData,1,-1)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    +
                </span>
            </button>
            <br></br>
            </div>
            <p className = "">Times:</p>
            <ul className="">
                {CurrentData.profile.times.sort((a,b) => (a.start_time > b.start_time) ? 1 :(a.start_time < b.start_time) ? -1 : 0).map(x => 
                    <li key={x.id}>
                        <br></br>
                        {x.start_time}  <TimeInput x={x} time_type={"start"}/>
                        <p>until</p>
                        {x.end_time}  <TimeInput x={x} time_type={"end"}/>
                        <br></br>
                        
                    </li>)
                }
                  </ul>
            <br></br>
            <br></br>

            <h2>Profiles: </h2>
            <br></br>
            <ul className="flex">{Profiles.map(x => <li key={x.id}><ProfileButton x={x}/> </li>)}</ul>

            {/*The above only works because we provided a default data when declaring with useState
            Otherwise, when the render occurs before data (as is my current understanding) map is attempted on an undefined type
            the JSON.stringify() calls were not failing in this way as that function can take undefined as an argument, 
            but map is a property of an array and the array must first exist...*/}
        </div>

    )
}

export default CurrentTimes


//<button onClick = {(x.id) => setCurrentProfile(x.id)}>{x.name} </button>