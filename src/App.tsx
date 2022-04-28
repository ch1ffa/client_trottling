import { useState, type FC } from 'react'
import { getPhotos } from './loader'
import './App.css'

export const App: FC = () => {
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  const ids = new Array(100).fill(0).map(() => Math.round(Math.random() * 5000));

  const loader = getPhotos(ids, 5);

  const loadImages = async () => {
    const data = await loader.next();
    const images = data.value as string[];
    if (images.length) {
      setImagesUrl(state => [...state, ...images]);
      return true;
    }
    return false;
  }

  const startLoading = async () => {
    while (await loadImages()) {
      await delay(3000);
    }
  }

  return (
    <div className="App">
      <button onClick={() => startLoading()}>Start</button>
      <div className="Image-Container">
        {
          imagesUrl.map((url, idx) => <img key={idx} src={url}/>)
        }
      </div>
    </div>
  )
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
