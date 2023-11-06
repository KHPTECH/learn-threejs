// 'use client'

import React from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';

export const useRunnerGame1 = () => {

    const mountRef = React.useRef(null);
    React.useEffect(() => {

        //scene
        const scene = new THREE.Scene();

        //sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        //Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 1000)
        camera.position.z = 5
        scene.add(camera)


        //renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(sizes.width, sizes.height)
        renderer.shadowMap.enabled = true

        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        // controls.enable = false

        class Box extends THREE.Mesh {
            constructor() {
                super(
                    new THREE.BoxGeometry(1, 1, 1),
                    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
                )
                this.width = width
                this.height = height
            }
        }

        //Create Box Function 

        function createBox({
            width,
            height,
            depth,
            color = '#00ff00',
            velocity = {
                x: 0,
                y: 0,
                z: 0,
            },
            position = {
                x: 0,
                y: 0,
                z: 0,
            }
        }) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshStandardMaterial({ color });
            const box = new THREE.Mesh(geometry, material);

            box.width = width;
            box.height = height;
            box.depth = depth;

            box.position.set(position.x, position.y, position.z)

            box.right = box.position.x + box.width / 2
            box.left = box.position.x - box.width / 2

            box.bottom = box.position.y - box.height / 2
            box.top = box.position.y + box.height / 2

            box.front = box.position.z + box.depth / 2
            box.back = box.position.z - box.depth / 2

            box.velocity = velocity
            box.gravity = -0.002

            const updateSides = () => {
                box.right = box.position.x + box.width / 2
                box.left = box.position.x - box.width / 2

                box.bottom = box.position.y - box.height / 2
                box.top = box.position.y + box.height / 2

                box.front = box.position.z - box.depth / 2
                box.back = box.position.z + box.depth / 2
            }

            box.update = (ground) => {
                updateSides()

                box.position.x += box.velocity.x
                box.position.z += box.velocity.z

                const xCollision = box.right >= ground.left && box.left <= ground.right
                const zCollision = box.front >= ground.back && box.back <= ground.front
                const yCollision = box.bottom <= ground.top && box.top >= ground.bottom
                // detect gravity

                if (xCollision && zCollision && yCollision) {
                    console.log("colliision", box.front, ground.back, box.front >= ground.back);
                }

                applyGravity()
            }
            const applyGravity = () => {
                box.velocity.y += box.gravity

                // this is where we hit the ground
                if (box.bottom + box.velocity.y <= ground.top) {
                    box.velocity.y *= 0.8
                    box.velocity.y = -box.velocity.y
                } else {
                    box.position.y += box.velocity.y
                }
            }

            return box;
        }
        const cube = createBox({
            width: 1,
            height: 1,
            depth: 1,
            velocity: {
                x: 0,
                y: -0.01,
                z: 0,
            }
        });

        cube.castShadow = true
        scene.add(cube)
        // console.log(cube.height);

        //ground
        const ground = createBox({
            width: 5,
            height: .5,
            depth: 10,
            color: "#0000ff",
            position: {
                x: 0,
                y: -2,
                z: 0,
            }
        });
        ground.receiveShadow = true

        scene.add(ground)


        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.z = 2
        light.position.y = 3
        light.castShadow = true

        scene.add(light)


        // axesHelper
        const axesHelper = new THREE.AxesHelper(100);
        // scene.add(axesHelper);

        //stats
        const stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';

        //movement control
        const keys = {
            a: {
                pressed: false
            },
            d: {
                pressed: false
            },
            w: {
                pressed: false
            },
            s: {
                pressed: false
            },

        }

        //keyboard input event
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    keys.a.pressed = true
                    break;
                case "ArrowRight":
                    keys.d.pressed = true
                    break;
                case "ArrowUp":
                    keys.w.pressed = true
                    break;
                case "ArrowDown":
                    keys.s.pressed = true
                    break;
                default:
                    break;
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    keys.a.pressed = false
                    break;
                case "ArrowRight":
                    keys.d.pressed = false
                    break;
                case "ArrowUp":
                    keys.w.pressed = false
                    break;
                case "ArrowDown":
                    keys.s.pressed = false
                    break;
                default:
                    break;
            }
        })

        //Animation
        const animate = () => {

            window.requestAnimationFrame(animate)
            renderer.render(scene, camera)
            //movement code
            cube.velocity.x = 0
            cube.velocity.z = 0
            if (keys.a.pressed) cube.velocity.x = -0.01
            else if (keys.d.pressed) cube.velocity.x = 0.01

            if (keys.w.pressed) cube.velocity.z = -0.01
            else if (keys.s.pressed) cube.velocity.z = 0.01

            cube.update(ground)
            // cube.rotation.x += 0.01
            // cube.rotation.y += 0.01
        }
        animate()

        mountRef.current.appendChild(renderer.domElement)
        mountRef.current.appendChild(stats.domElement)
        return () => mountRef.current.removeChild(renderer.domElement);
    }, []);

    return {
        mountRef
    };
};
