export const requestChatGPT = async (url: string, authContent: string) => {
  console.log("requestChatGPT", url, authContent);

  const headers = {
    'Authorization': authContent
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  const data = await response.json();
  console.log("data", data);
}