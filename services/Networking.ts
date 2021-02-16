import 'firebase/auth';
import firebase from 'firebase/app';

const _IS_LOCAL = true;
const networkUrl = 'https://desolate-anchorage-45430.herokuapp.com';
const localUrl = 'http://localhost:8000';
// const socket = io(networkUrl, {transports: ['websocket']})

export const urlWithPath = (path: string) => {
  let url = networkUrl;
  if (_IS_LOCAL) {
    url = localUrl;
  }
  return url + path;
};

export const makeRequest = async (
  url: string,
  method: string,
  body?: any
): Promise<Response> => {

  const idToken = await firebase.auth().currentUser.getIdToken();
  return fetch(url, {
    method:  method,
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${idToken}`
    },
    body: body ? JSON.stringify(body) : null
  });
};

export const createUserWithTwitter = (userDetails: any): Promise<Response> => {
  return makeRequest(urlWithPath('/api/user/twitter'), 'POST', {
    user: userDetails
  });
};

export const getAgoraToken = async (roomId: string): Promise<string> => {
  const result = await makeRequest(
    urlWithPath(`/api/room/agoraToken/${roomId}`),
    'GET'
  );

  const responseJson = await result.json();
  console.log(responseJson);
  const token = responseJson.token as string;
  return token;
};

