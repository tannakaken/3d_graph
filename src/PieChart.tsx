import { button, useControls } from "leva";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

import type { ButtonInput } from "leva/dist/declarations/src/types";
import { Prompt } from "./Prompt";
import { resolveColor } from "./helpers/color.helper";

const initialData = () => ([
  {name: "item 1", value: 3},
  {name: "item 2", value: 7},
]);

const initialTitle = () => ({
  'item 1': 'item 1',
  'item 2': 'item 2',
})

const isSpecialKey = (name: string) => {
  return name === "height" || name === "start angle" || name === "add value" || name === "reset values";
}

const RADIUS = 3;

/**
 * 円グラフを表すr3fの3DUI
 */
export const PieChart = () => {
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
          })
        }),
        "reset values": button(() => {
          for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            if (i === 0) {
              set({[datum.name]: 3})
            } else if (i === 1) {
              set({[datum.name]: 7});
            } else {
              set({[datum.name]: 5});
            }
          }
          setData(initialData());
          setTitles(initialTitle());
        }),
        "height": 1,
        "start angle": {value: 0, step: 1},
      } as Record<string, number | ButtonInput | {value: number, step: number}>
    ),
    [data, titles],
  );

  const getValue = (name: string) => {
    if (isSpecialKey(name)) {
      return 0;
    }
    return controls[name] as number;
  }

  const total = Object.keys(controls).reduce(
    (sum: number, name) => sum + getValue(name),
    0
  );
  const startAngleDeglee = -controls["start angle"] as number + 90;
  let startAngle =  startAngleDeglee / 180 * Math.PI;
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
        set({"start angle": 0});
      }
    }
  }, [hoveredIndex, data, set]);


  return (
    <group>
      {Object.keys(controls).map((name, index) => {
        if (isSpecialKey(name)) {
          return;
        }
        const value = controls[name] as number;
        const angle = (value / total) * Math.PI * 2;
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.arc(0, 0, RADIUS, startAngle, startAngle - angle, true);
        shape.lineTo(0, 0);
        startAngle -= angle;

        const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
          depth: controls.height as number,
          bevelEnabled: false, // 角を斜めにしない
        });
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(
            resolveColor(index, data.length)
          ),
        });

        const labelAngle = startAngle + angle / 2;
        const labelX = Math.round(RADIUS / 2) * Math.cos(labelAngle);
        const labelY = Math.round(RADIUS / 2) * Math.sin(labelAngle);

        return (
          <React.Fragment key={`pie-chart-segment-${name}`}>
            <mesh
              geometry={shapeGeometry}
              material={material}
            />
            {[controls.height as number + 0.1, -0.1].map((height) => (
              <Text
                key={`label-for-${name}-height-${height}`}
                position={[labelX, labelY, height]}
                fontSize={0.5}
                color={index === hoveredIndex ? "blue" : "black"}
                anchorX="center"
                anchorY="middle"
                onClick={async (event) => {
                  // これをしないと、グラフの向こう側のTextのクリックイベントが発火することがある。
                  event.stopPropagation();
                  const newTitle = await Prompt.call({message: "データの名前を入力してください。", defaultValue: titles[name]})
                  if (newTitle) {
                    titles[name] = newTitle;
                    setTitles({...titles});
                  }
                }}
                onPointerOver={() => setHoveredIndex(index)}
                onPointerOut={() => setHoveredIndex(undefined)}
              >
                {titles[name]}
              </Text>)
            )}
          </React.Fragment>
        );
      })}
    </group>
  );
};
