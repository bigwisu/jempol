export interface Photo {
  code: string;
  caption: string;
  likes: number;
  hates: number;
  display_src: string;
  id: string;
}

export interface User {
  imageUrl: string,
  name: string
}