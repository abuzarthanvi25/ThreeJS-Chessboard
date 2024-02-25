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
                    this.color == 'white' ? "#D8A400" : "#6D6D6D"
                );
          
                color.convertSRGBToLinear();
                o.material = new THREE.MeshPhysicalMaterial({
                    clearcoat: 1.5,
                    clearcoatRoughness: 0.7,
                    metalness: 0.7,
                    roughness: 0.25,
                    color: color,
                    emissive: "#202020",
                    emissiveIntensity: 0.5
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