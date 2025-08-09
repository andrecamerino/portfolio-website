import * as THREE from "three";

// ===== Fog settings =====
export const FOG_COLOR = "#000000"; // black fade
export const FOG_NEAR = 30;          // start fading just after the model
export const FOG_FAR = 40;          // fade out completely before the floor ends

export const CAMERA_BASE = new THREE.Vector3(-5, 4, -4);
export const CAMERA_ZOOM = 1.5;
export const CAMERA_SHIFT_X = 1;

export const CAMERA_POS = new THREE.Vector3(
  CAMERA_BASE.x * CAMERA_ZOOM + CAMERA_SHIFT_X,
  CAMERA_BASE.y * CAMERA_ZOOM,
  CAMERA_BASE.z * CAMERA_ZOOM
);

export const CAMERA_LOOK_AT = new THREE.Vector3(CAMERA_SHIFT_X, 0, 0);

export const MODEL_SCALE = 1;
export const MODEL_POSITION = new THREE.Vector3(0, 0.2, 0.5);

export const KEY_LIGHT_INTENSITY = 2000;
export const BLUE_LIGHT_INTENSITY = 3000;
export const RED_LIGHT_INTENSITY = 250;

export const SHADOW_BIAS = -0.0005;

export const FLOOR_SIZE = 1000;
export const FLOOR_Y = -0.4;
export const FLOOR_COLOR = "#1a1a1a";
export const FLOOR_METALNESS = 0.1;
export const FLOOR_ROUGHNESS = 0.9;

export const KEY_LIGHT_POS = new THREE.Vector3(-10, 16, 10);
export const KEY_LIGHT_TARGET_POS = MODEL_POSITION.clone();

export const BLUE_LIGHT_POS = new THREE.Vector3(10, 1, -20);
export const BLUE_LIGHT_TARGET_POS = new THREE.Vector3(0, 3, 0);

export const RED_LIGHT_POS = new THREE.Vector3(10, 1, 10);
export const RED_LIGHT_TARGET_POS = new THREE.Vector3(0, RED_LIGHT_POS.y + 1, 0);

export const TEXT_POS = new THREE.Vector3(2, FLOOR_Y + 0.01, -0.5);
export const TEXT_SIZE = 0.4;
export const TEXT_COLOR = "white";

export const ROTATING_WORDS = [
  "developer",
  "software developer",
  "full-stack dev",
  "web dev",
  "student",
  "videographer",
  "designer",
  "content creator",
  "tech enthusiast",
  "programmer",
  "coder",
  "UI/UX designer",
  "nutella lover!",
  "compsci kid",
  "compsci class rep!",
];