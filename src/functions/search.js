import axios from "axios";

const search = async (searchString) =>{
    const {data} = await axios.get(`api/video/search/${searchString}`)
    console.log(data)
    return data;
}

export default search;