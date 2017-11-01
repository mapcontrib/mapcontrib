export default function dummyPromiseCallback(resolve, reject, err) {
  if (err) {
    reject(err);
    throw err;
  }

  resolve();
}
