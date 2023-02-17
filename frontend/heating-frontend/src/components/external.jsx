import React, {useEffect, useState} from 'react'

const ExternalJSON = () => {
    const [ExternalData, setData] = useState([]);


    useEffect(() => {
        fetch("https://dummyjson.com/products")
            .then((response) => response.json())
            .then((data) => setData(data.products));
    },[])

    return (
        <div>
            <h2>External Data</h2>
            <br></br>
            
            <br></br>
            <br></br>
            <ul>{ExternalData.map(x => <li key={x.id}>{x.title}</li>)}</ul>

        </div>
    )
    //<p>{JSON.stringify(ExternalData)}</p>
    //            <ul>{ExternalData.map(x => <li key={x.id}>{x.start_time}</li>)}</ul>
}

export default ExternalJSON