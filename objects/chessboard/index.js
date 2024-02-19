import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import DebugUI from "../../debuggers";

export class Chessboard {
    constructor(scene) {
        this.scene = scene;
        this.squarePositions = {}; // Object to store square positions
        this.model = new THREE.Group();
    }

    getSquarePosition(chessboardCoord) {
        return this.squarePositions[chessboardCoord];
    }
    
    placeObjectAtPosition(chessCoord, object3D) {
        const position = this.squarePositions[chessCoord];
        if (position) {
            object3D.position.copy(position);
            this.model.add(object3D);
        } else {
            console.error(`Invalid chess coordinate: ${chessCoord}`);
        }
    }

    async init() {
        const squareSize = 2; // Size of each square
        const numSquares = 8; // Number of squares per side
        const boardSize = squareSize * numSquares; // Total size of the board
        const borderWidth = 1.8; // Thickness of the border

        for (let i = 0; i < numSquares; i++) {
            for (let j = 0; j < numSquares; j++) {
                const squareGeometry = new THREE.BoxGeometry(squareSize, squareSize, squareSize, squareSize);
                const squareMaterial = new THREE.MeshStandardMaterial({
                    color: (i + j) % 2 === 0 ? "#D8A400" : "#3A3A3A", // Alternate colors
                    roughness: 0.3,
                    metalness: 0.4
                });
                const square = new THREE.Mesh(squareGeometry, squareMaterial);
                const chessCoord = String.fromCharCode(65 + i) + (numSquares - j); // Convert indices to chess notation
                square.position.set(i * squareSize - boardSize / 2 + squareSize / 2, 0, j * squareSize - boardSize / 2 + squareSize / 2);
                this.model.add(square);

                // Store the position in the squarePositions object
                this.squarePositions[chessCoord] = new THREE.Vector3(i * squareSize - boardSize / 2 + squareSize / 2, 2, j * squareSize - boardSize / 2 + squareSize / 2);
            }
        }

        // Create the border
        this.createBorders(boardSize, borderWidth);

        return this.model;
    }

    async createTextGeometry(text, size = 0.5) {
        return new Promise((resolve, reject) => {
            const loader = new FontLoader();

            loader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const geometry = new TextGeometry(text, {
                    font: font,
                    size: size,
                    height: 0.05,
                    curveSegments: 12,
                    bevelEnabled: false
                });

                geometry.center();
                resolve(geometry);
            }, undefined, reject);
        });
    }

    async createBorders(boardSize, borderWidth) {
        const borderGeometryX = new THREE.BoxGeometry(boardSize + 2 * borderWidth, borderWidth, borderWidth);
        const borderGeometryZ = new THREE.BoxGeometry(borderWidth, borderWidth, boardSize);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: "#000000", // Color of the border
            metalness: 0.4,
            roughness: 0.01
        });

        const borderX1 = new THREE.Mesh(borderGeometryX, borderMaterial);
        borderX1.position.set(0, 0, -boardSize / 2 - borderWidth / 2);
        this.model.add(borderX1);

        const borderX2 = new THREE.Mesh(borderGeometryX, borderMaterial);
        borderX2.position.set(0, 0, boardSize / 2 + borderWidth / 2);
        this.model.add(borderX2);

        const borderZ1 = new THREE.Mesh(borderGeometryZ, borderMaterial);
        borderZ1.position.set(-boardSize / 2 - borderWidth / 2, 0, 0);
        this.model.add(borderZ1);

        const borderZ2 = new THREE.Mesh(borderGeometryZ, borderMaterial);
        borderZ2.position.set(boardSize / 2 + borderWidth / 2, 0, 0);
        this.model.add(borderZ2);

        // Add labels
        const labelsX = "HGFEDCBA";
        const labelsZ = "87654321";

        const labelMaterial = new THREE.MeshStandardMaterial({ color: "#D8A400", roughness: 0.3, metalness: 0.4 });

        // Add labels on the X borders (numbers)
        for (let i = 0; i < 8; i++) {
            const textGeometry = await this.createTextGeometry(labelsZ[i]);
            const textMesh = new THREE.Mesh(textGeometry, labelMaterial);
            textMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees around X axis
            textMesh.position.set(-boardSize / 2 + borderWidth + (7 - i) * (boardSize / 8) - 0.8, 1, -boardSize / 2.3 - borderWidth);
            this.model.add(textMesh);
        }

        // Add labels on the Z borders (letters)
        for (let i = 0; i < 8; i++) {
            const textGeometry = await this.createTextGeometry(labelsX[7 - i]); // Use the reversed array for letters
            const textMesh = new THREE.Mesh(textGeometry, labelMaterial);
            textMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees around X axis
            textMesh.rotation.z = -Math.PI / 2; // Rotate 90 degrees around X axis
            textMesh.position.set(-boardSize / 2 - borderWidth + 1, 1, -boardSize / 2 + borderWidth + i * (boardSize / 8) - 0.8);
            this.model.add(textMesh);
        }

        this.model.rotation.x = -Math.PI * 2; // Rotate to be flat on the ground
        this.model.rotation.y = 1.6;

        this.scene.add(this.model);
    }
}