import { useState } from "react";

export const useLoader = (
  ids: number[],
  maxParallelRequests: number,
  maxRequestsPerSecond: number
) => {
  const [data, setData] = useState<string[]>([]);

  const requests = ids.map(id => async () => {
    const response = await fetch(`http://jsonplaceholder.typicode.com/photos/${id}`);
    if (response.ok) {
      const json = await response.json();
      setData(state => [...state, json.thumbnailUrl]);
    } else {
      // Put empty url to show corrupted fetch result
      setData(state => [...state, '']);
    }
  });

  const runLoader = async () => {
    const queue: Promise<void>[] = [];
    let rps = 0;
    let startedAt = Date.now();
    for (let request of requests) {
      const timeToSecond = 1000 - Date.now() + startedAt;
      if (timeToSecond > 0) {
        rps += 1;
      } else {
        rps = 1;
        startedAt = Date.now();
      }
      const promise = request().then(res => {
        queue.splice(queue.indexOf(promise), 1);
        return res
      })
      queue.push(promise);
      if (queue.length >= maxParallelRequests) {
        await Promise.race(queue);
      }
      if (rps >= maxRequestsPerSecond) {
        await delay(timeToSecond);
      }
    }

    await Promise.all(queue);
  }

  return { data, runLoader }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
