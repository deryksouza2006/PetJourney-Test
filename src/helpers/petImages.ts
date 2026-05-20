const petImages: Record<string, any> = {
  cachorro: require('../../assets/pets/dog.png'),
  gato: require('../../assets/pets/cat.png'),
  ave: require('../../assets/pets/bird.png'),
  'pássaro': require('../../assets/pets/bird.png'),
  passaro: require('../../assets/pets/bird.png'),
  peixe: require('../../assets/pets/fish.png'),
};

const defaultImage = require('../../assets/pets/default.png');

export function getPetImage(species: string): any {
  return petImages[species.toLowerCase()] ?? defaultImage;
}
