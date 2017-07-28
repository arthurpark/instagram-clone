const { Environment, Network, RecordSource, Store } = require('relay-runtime');

const store = new Store(new RecordSource());

const network = Network.create((operation, variables) =>
  fetch('https://api.graph.cool/relay/v1/cj5n3hh2lzdeq01341uidaxwc', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => response.json())
);

const environment = new Environment({
  network,
  store
});

export default environment;
