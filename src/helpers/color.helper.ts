export const resolveColor = (index: number, totalLength: number): string => 
     `hsl(${(index / totalLength) * 360}, 100%, 50%)`;
