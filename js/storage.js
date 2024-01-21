const STORAGE_TOKEN = "V5HNRQEZSGQ1KV07QTALE2TTK4Y4TI192AMQXEAR";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";


/**
 * compiles the data into a payload and loads it into the server
 * 
 * @param {string} key some kind of name to identify the load
 * @param {object} value The actual payload, ideally as JSON.
 * @returns 
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * fetches the data identified by the string from the server
 * 
 * @param {string} key some kind of name to identify the load
 * @returns 
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
