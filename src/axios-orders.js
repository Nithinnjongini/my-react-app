import axios from 'axios'

const instance= axios.create({

    baseURL:'https://react-my-burger-bfbe7.firebaseio.com/'
});

export default instance;