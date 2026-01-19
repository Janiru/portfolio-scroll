import fs from 'fs';
import path from 'path';
import GalleryClient from './GalleryClient';

export default async function Gallery() {
    const imagesDirectory = path.join(process.cwd(), 'public/images');
    const filenames = await fs.promises.readdir(imagesDirectory);

    const images = filenames
        .filter(file => /\.(webp|png|jpg|jpeg|svg)$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map(file => `/images/${file}`);

    return <GalleryClient images={images} />;
}
