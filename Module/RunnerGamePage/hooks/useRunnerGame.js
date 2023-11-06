// 'use client'

import React from "react";
import * as THREE from "three";
import { OrbitControls, } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';

export const useRunnerGame = () => {

    const mountRef = React.useRef(null);
    React.useEffect(() => {

        //scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x88ccee);
        scene.fog = new THREE.Fog(0x88ccee, 0, 50);

        //sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        //Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .01, 1000)
        camera.position.z = 10
        camera.position.y = 5
        scene.add(camera)



        //cursor
        const cursor = {
            x: 0,
            y: 0,
        }
        window.addEventListener('mousemove', (event) => {
            cursor.x = event.clientX / sizes.width - 0.5
            cursor.y = -(event.clientY / sizes.height - 0.5)

            // console.log(cursor.x ,cursor.y);
        })

        //resize window 
        window.addEventListener("resize", () => {

            sizes.width = window.innerWidth,
                sizes.height = window.innerHeight

            //update camera 
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            //update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        })




        //renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(sizes.width, sizes.height)
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.SRGBColorSpace

        //stats
        const stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';


        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enable = false

        controls.enableDamping = true


        //Box 

        const geomerty = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: "pink" })
        const cube = new THREE.Mesh(geomerty, material)

        scene.add(cube)



        // Create terrain
        const terrainGeometry = new THREE.PlaneGeometry(10, 100);
        const terrainMaterial = new THREE.MeshBasicMaterial({ color: 0x008000, side: THREE.DoubleSide });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        scene.add(terrain);

        // axesHelper
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);


        //Animation
        const animate = () => {

            window.requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        animate()

        mountRef.current.appendChild(renderer.domElement)
        mountRef.current.appendChild(stats.domElement)
        renderer.render(scene, camera)
        return () => mountRef.current.removeChild(renderer.domElement);
    }, []);

    return {
        mountRef
    };
};
