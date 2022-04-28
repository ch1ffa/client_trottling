export async function* getPhotos(ids: number[], count: number){
  let images = [];
  for (let i = 0; i < ids.length; i++) {
    const response = await fetch(`http://jsonplaceholder.typicode.com/photos/${ids[i]}`);
    const json = await response.json();
    images.push(json.thumbnailUrl);
    if ((i + 1) % count === 0) {
      yield images;
      images = [];
    }
  }
}
