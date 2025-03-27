import { button, useControls } from "leva";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";

import type { ButtonInput } from "leva/dist/declarations/src/types";

const initialData = () => ([
  { name: "point 1", value: 1 },
  { name: "point 2", value: 2 },
  { name: "point 3", value: 3 },
]);

const initialTitle = () => ({
  'point 1': 'point 1',
  'point 2': 'point 2',
  'point 3': 'point 3',
});


/**
 * 3D Line Chart component using React Three Fiber
 */
export const LineChart = () => {
  const [data, setData] = useState(initialData());
  const [titles, setTitles] = useState<Record<string, string>>(initialTitle());

  const [controls] = useControls(
    () => data.reduce(
      (acc, datum) => {
        acc[datum.name] = datum.value;
        return acc;
      },
      {
        "add value": button(() => {
          const newName = `point ${data.length + 1}`;
          setData([
            ...data,
            {
              name: newName,
              value: data.length + 1,
            },
          ]);
          setTitles({
            ...titles,
            [newName]: newName,
          });
        }),
        "reset value": button(() => {
          setData(initialData());
          setTitles(initialTitle());
        }),
      } as Record<string, number | ButtonInput>,
    ),
    [data],
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredIndex]);

  const points = data.map((datum, index) => new THREE.Vector3(index, controls[datum.name] as number, 0));

  return (
    <group>
      <Line points={points} color="blue" lineWidth={2} />
      {data.map((datum, index) => (
        <Text
          key={`label-for-${datum.name}`}
          position={[index, controls[datum.name] as number + 0.5, 0]}
          fontSize={0.5}
          color={index === hoveredIndex ? "blue" : "white"}
          anchorX="center"
          anchorY="middle"
          onClick={() => {
            const newTitle = prompt("データの名前を入力してください", titles[datum.name]);
            if (newTitle) {
              titles[datum.name] = newTitle;
              setTitles({ ...titles });
            }
          }}
          onPointerOver={() => setHoveredIndex(index)}
          onPointerOut={() => setHoveredIndex(undefined)}
        >
          {titles[datum.name]}
        </Text>
      ))}
    </group>
  );
};