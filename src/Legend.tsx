import { Line, Text } from '@react-three/drei';
import { resolveColor } from './helpers/color.helper';
import { useEffect, useState } from 'react';

interface LegendProps {
    totalLength: number;
    items: { index: number; label: string }[];
    position: [number, number, number];
    onClick: (index: number) => Promise<void>;
}

const shift = (origin: [number, number, number], index: number, totalLength: number): [number, number, number] => {
    const x = origin[0];
    const y = origin[1] + (totalLength - index - 1) * 0.5;
    const z = origin[2];
    return [x, y, z];
};

const linePositions = (origin: [number, number, number], index: number, totalLength: number): [number, number, number][] => {
    const [x, y, z] = shift(origin, index, totalLength);
    return [[x, y, z], [x + 0.5, y, z]];
};

const textPosition = (origin: [number, number, number], index: number, totalLength: number): [number, number, number] => {
    const [x, y, z] = shift(origin, index, totalLength);
    return [x + 0.6, y, z];
};

const Legend: React.FC<LegendProps> = ({ items, totalLength, position, onClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
    useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
        document.body.style.cursor = 'auto';
    };
      }, [hoveredIndex]);
    return (
        <group>
            {items.map((item, index) => (
                <group key={`label-${index}-${item.label}`}>
                    <Line color={resolveColor(index, totalLength)} points={linePositions(position, index, totalLength)} />
                    <Text 
                        position={textPosition(position, index, totalLength)}
                        fontSize={0.2}
                        color={index === hoveredIndex ? "blue" : "white"}
                        anchorX="left"
                        anchorY="middle"
                        onClick={() => onClick(index)}
                        onPointerOver={() => setHoveredIndex(index)}
                        onPointerOut={() => setHoveredIndex(undefined)}
                    >
                        {item.label}
                    </Text>
                </group>
            ))}
        </group>
    );
};

export default Legend;