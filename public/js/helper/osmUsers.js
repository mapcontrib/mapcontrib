import { DOMParser } from 'xmldom';

function buildWhosthatEndPoint(argParams = {}) {
  const whosthatEndPoint = 'http://whosthat.osmz.ru/whosthat.php';
  const defaultParams = {
    q: '',
    action: 'names'
  };

  const params = { ...defaultParams, ...argParams };
  const searchParams = new URLSearchParams();

  for (const paramName of Object.keys(params)) {
    searchParams.append(paramName, params[paramName]);
  }

  const queryString = searchParams.toString();

  return `${whosthatEndPoint}?${queryString}`;
}

export function findUsersFromDisplayName(displayName) {
  const endPoint = buildWhosthatEndPoint({
    q: displayName
  });

  return fetch(endPoint)
    .then(response => response.json())
    .then(users =>
      users.map(user => ({
        id: user.id,
        displayName: user.names[user.names.length - 1]
      }))
    );
}

export function getUserInfoFromId(userId) {
  return fetch(`https://www.openstreetmap.org/api/0.6/user/${userId}`)
    .then(response => response.text())
    .then(xmlString => new DOMParser().parseFromString(xmlString, 'text/xml'))
    .then(xmlDoc => {
      const user = xmlDoc.getElementsByTagName('user')[0];
      const img = xmlDoc.getElementsByTagName('img')[0];
      return {
        id: user.getAttribute('id'),
        displayName: user.getAttribute('display_name'),
        accountCreated: user.getAttribute('account_created'),
        avatar: img ? img.getAttribute('href') : ''
      };
    });
}
