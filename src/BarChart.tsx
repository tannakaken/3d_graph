import { button, useControls } from "leva";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

import type { ButtonInput } from "leva/dist/declarations/src/types";

const initialData = () => ([
  { name: "item 1", value: 3 },
  { name: "item 2", value: 7 },
]);

const initialTitle = () => ({
  'item 1': 'item 1',
  'item 2': 'item 2',
});

const isSpecialKey = (name: string) => {
  return name === "height" || name === "add value" || name === "reset value";
};

/**
 * 3D Bar Chart component using React Three Fiber
 */
export const BarChart = () => {
  const [data, setData] = useState(initialData());
  const [titles, setTitles] = useState<Record<string, string>>(initialTitle());

  const [controls, set] = useControls(
    () => data.reduce(
      (acc, datum) => {
        acc[datum.name] = datum.value;
        return acc;
      },
      {
        "add value": button(() => {
          const newName = `item ${data.length + 1}`;
          setData([
            ...data,
            {
              name: newName,
              value: 5,
            },
          ]);
          setTitles({
            ...titles,
            [newName]: newName,
          });
        }),
        "reset value": button(() => {
          for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            if (i === 0) {
              set({ [datum.name]: 3 });
            } else if (i === 1) {
              set({ [datum.name]: 7 });
            } else {
              set({ [datum.name]: 5 });
            }
          }
          setData(initialData());
          setTitles(initialTitle());
        }),
        "height": 1,
      } as Record<string, number | ButtonInput>,
    ),
    [data],
  );

  const getValue = (name: string) => {
    if (isSpecialKey(name)) {
      return 0;
    }
    return controls[name] as number;
  };

  const total = Object.keys(controls).reduce(
    (sum: number, name) => sum + getValue(name),
    0,
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredIndex]);

  return (
    <group>
      {Object.keys(controls).map((name, index) => {
        if (isSpecialKey(name)) {
          return;
        }
        const value = controls[name] as number;
        const barHeight = (value / total) * 10;
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            `hsl(${(index / data.length) * 360}, 100%, 50%)`,
          ),
        });

        return (
          <React.Fragment key={`bar-chart-segment-${name}`}>
            <mesh
              position={[index * 2 - data.length, barHeight / 2, 0]}
              geometry={new THREE.BoxGeometry(1, barHeight, 1)}
              material={material}
            />
            <Text
              position={[index * 2 - data.length, barHeight + 0.5, 0]}
              fontSize={0.5}
              color={index === hoveredIndex ? "blue" : "black"}
              anchorX="center"
              anchorY="middle"
              onClick={() => {
                const newTitle = prompt("データの名前を入力してください", titles[name]);
                if (newTitle) {
                  titles[name] = newTitle;
                  setTitles({ ...titles });
                }
              }}
              onPointerOver={() => setHoveredIndex(index)}
              onPointerOut={() => setHoveredIndex(undefined)}
            >
              {titles[name]}
            </Text>
          </React.Fragment>
        );
      })}
    </group>
  );
};