import { button, useControls } from "leva";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

import type { ButtonInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";
import { resolveColor } from "./helpers/color.helper";

const initialData = () => ([
  { name: "item 1", value: 3 },
  { name: "item 2", value: 7 },
]);

const initialTitle = () => ({
  'item 1': 'item 1',
  'item 2': 'item 2',
});

const isSpecialKey = (name: string) => {
  return name === "height" || name === "add value" || name === "reset values";
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
        "reset values": button(() => {
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
    [data, titles],
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    document.body.style.cursor = hoveredIndex !== undefined ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
      for (let i = 0; i < data.length; i++) {
        const datum = data[i];
        if (i === 0) {
          set({ [datum.name]: 3 });
        } else if (i === 1) {
          set({ [datum.name]: 7 });
        } else {
          set({ [datum.name]: 5 });
        }
        set({height: 1});
      }
    };
  }, [hoveredIndex, data, set]);

  return (
    <group>
      {Object.keys(controls).map((name, index) => {
        if (isSpecialKey(name)) {
          return;
        }
        const value = controls[name] as number;
        const barHeight = value / 5;
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            resolveColor(index, data.length),
          ),
        });

        return (
          <React.Fragment key={`bar-chart-segment-${name}`}>
            <mesh
              position={[2 * (index - data.length - 1), barHeight / 2, 0]}
              geometry={new THREE.BoxGeometry(1, barHeight, controls.height as number)}
              material={material}
            />
            <Text
              position={[2 * (index - data.length - 1), barHeight + 0.5, 0]}
              fontSize={0.5}
              color={index === hoveredIndex ? "blue" : "white"}
              anchorX="center"
              anchorY="middle"
              onClick={async () => {
                const newTitle = await Prompt.call({message: "データの名前を入力してください。", defaultValue: titles[name]});
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