import axios from 'axios';

export default axios.create({
	baseURL : 'https://europe-west3-squeaker-223c7.cloudfunctions.net/api',
});
