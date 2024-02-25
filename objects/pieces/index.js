import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ChessPiece extends THREE.Group {
    constructor(modelURL, color, name) {
        super();

        this.name = name
        this.color = color;
        this.init(modelURL);
    }

    init(modelURL){
        this.loadModel(modelURL).then((gltf) => {
            const model = gltf?.scene;


            model.traverse((o) => {
                if (!o.isMesh) {
                  return;
                }
          
                o.userData.lastParent = this;
          
                o.castShadow = true;
                o.receiveShadow = true;
          
                const color = new THREE.Color(
                    this.color == 'white' ? "#ffffff" : "#000000"
                );
          
                color.convertSRGBToLinear();
                o.material = new THREE.MeshStandardMaterial({
                  color,
                  roughness: 0.1,
                  metalness: 0.6
                });
              });

            this.add(model)

        })
    }

    loadModel(modelURL) {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            // Load 3D model
            loader.load(
                modelURL,
                (gltf) => {
                    resolve(gltf)
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        })

    }

    setColor(color) {
        this.color = color;
        // Set color of the piece material or texture based on the color parameter
    }
}