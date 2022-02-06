# deno-simple-api

#### Super simple web-api done with deno, oak and denodb. Testing is done with superoak.

This api currently handles medical data, containing data from medical measurements

1. Start local development with `npm start`

2. Build docker image with `npm run build`

3. Run docker image with `docker-compose up -d`


Currently data structure is laid like so:

```typescript
interface Measurement {
  // Measurement's identifier code
  code: string;

  // Measurement's name
  name: string;

  // Measurement's unit ex. g/l.
  unit: string;

  // Measurement's reference values, upper and lower values for a healthy human
  referenceValues: {
    lower: number;
    upper: number;
  };
}
```


Run tests with `npm test`