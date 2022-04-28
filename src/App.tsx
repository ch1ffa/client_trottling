import type { FC } from 'react'
import { useLoader } from './hooks/useLoader';
import './App.css'

const MAX_RPS = 8;
const MAX_PARALLEL_REQUESTS = 4;

export const App: FC = () => {
  // Here we use id = 0 with 0.1 probability to test fetch error
  const ids = new Array(100).fill(0).map(() => Math.random() > 0.1 ? Math.round(Math.random() * 5000) : 0);

  const { data, runLoader } = useLoader(ids, MAX_PARALLEL_REQUESTS, MAX_RPS);

  return (
    <div className="App">
      <button onClick={() => runLoader()}>Start</button>
      <div className="Image-Container">
        {
          data.map((url, idx) =>
            <img 
              key={idx}
              src={url}
              style={{ width: 150, height: 150 }}
            />
          )
        }
      </div>
    </div>
  )
}
