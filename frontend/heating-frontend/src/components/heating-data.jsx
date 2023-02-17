import React, {useEffect, useState} from 'react'







const CurrentTimes = () => {
    const [CurrentData, setData] = useState({current:{boost:"example"},profile:{times:[{id:1,current_time:'no time Toulouse'}]}});
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
            <p className={Date.parse(CurrentData.current.boost) < Date.now() ? "text-red-500" : "text-green-500"}>Boost: {JSON.stringify(CurrentData.current.boost)}</p>
            <p>Day Temp: {JSON.stringify(CurrentData.profile.day_temp)}</p>
            <p>Night Temp: {JSON.stringify(CurrentData.profile.night_temp)}</p>
            <br></br>
            </div>
            <p className = "">Times:</p>
            <ul className="">{CurrentData.profile.times.sort((a,b) => (a.start_time > b.start_time) ? 1 :(a.start_time < b.start_time) ? -1 : 0).map(x => <li key={x.id}>{x.start_time} : {x.end_time}</li>)}</ul>
            <br></br>
            <br></br>



            <ul className="flex"><h2>Profiles: </h2>{Profiles.map(x => <li key={x.id}><ProfileButton x={x}/> </li>)}</ul>

            {/*The above only works because we provided a default data when declaring with useState
            Otherwise, when the render occurs before data (as is my current understanding) map is attempted on an undefined type
            the JSON.stringify() calls were not failing in this way as that function can take undefined as an argument, 
            but map is a property of an array and the array must first exist...*/}
        </div>

    )
}

export default CurrentTimes


//<button onClick = {(x.id) => setCurrentProfile(x.id)}>{x.name} </button>