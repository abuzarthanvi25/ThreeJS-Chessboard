import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import DebugUI from "../../debuggers";
import { Pawn } from '../pieces/pawn';
import { Rook } from '../pieces/rook';
import { Bishop } from '../pieces/bishop';
import { King } from '../pieces/king';
import { Queen } from '../pieces/queen';
import { Knight } from '../pieces/knight';

export class Chessboard {
    constructor(scene) {
        this.scene = scene;
        this.squarePositions = {}; // Object to store square positions
        this.model = new THREE.Group();
    }

    createBoard(){
        
        const squareSize = 2; // Size of each square
        const numSquares = 8; // Number of squares per side
        const boardSize = squareSize * numSquares; // Total size of the board
        const borderWidth = 1.8; // Thickness of the border
        const fileLetters = "ABCDEFGH"; // File letters for chess coordinates

        for (let i = 0; i < numSquares; i++) {
            for (let j = 0; j < numSquares; j++) {
                const squareGeometry = new THREE.BoxGeometry(squareSize, squareSize, squareSize, squareSize);
                const squareMaterial = new THREE.MeshStandardMaterial({
                    color: (i + j) % 2 === 0 ? "#D8A400" : "#3A3A3A", // Alternate colors
                    roughness: 0.3,
                    metalness: 0.4
                });
                const square = new THREE.Mesh(squareGeometry, squareMaterial);
                square.position.set(i * squareSize - boardSize / 2 + squareSize / 2, 0, j * squareSize - boardSize / 2 + squareSize / 2);
                this.model.add(square);                
            }
        }


    // Set pieces
        this.model.children.forEach((square, index) => {
            const rowIndex = Math.floor(index / numSquares);
            const colIndex = index % numSquares;
            const chessCoord = fileLetters[colIndex] + (rowIndex + 1);
            
            // Store the position in the squarePositions object
            this.squarePositions[chessCoord] = new THREE.Vector3(square.position.x, 1 + square.position.y,square.position.z);
        });
        
        // Create the border
        this.createBorders(boardSize, borderWidth);
        
        return this.model;
    }
    
    getSquarePosition(chessboardCoord) {
        return this.squarePositions[chessboardCoord];
    }
    
    placeObjectAtPosition(chessCoord, object3D) {
        const position = this.squarePositions[chessCoord];
        if (position) {
            if(object3D.color == 'white'){
                object3D.rotation.y += Math.PI * 1/2
            }else{
                object3D.rotation.y -= Math.PI * 1/2
            }
            object3D.position.copy(position);
            object3D.scale.set(36, 36, 36)
            this.model.add(object3D)
        } else {
            console.error(`Invalid chess coordinate: ${chessCoord}`);
        }
    }

    movePiece(fromChessCoord, toChessCoord) {
        const fromPosition = this.squarePositions[fromChessCoord];
        const toPosition = this.squarePositions[toChessCoord];
        
        if (!fromPosition || !toPosition) {
            console.error("Invalid chess coordinates provided.");
            return;
        }
        
        // Find the piece at the 'from' position
        const pieceToRemove = this.model.children.find(square => square.position.equals(fromPosition));
        if (!pieceToRemove) {
            console.error("No piece found at the specified 'from' position.");
            return;
        }

        // Remove any existing piece at the 'to' position
        const existingPiece = this.model.children.find(square => square.position.equals(toPosition));
        if (existingPiece) {
            this.model.remove(existingPiece);
        }

        // Move the piece to the 'to' position
        pieceToRemove.position.copy(toPosition);
    }

    async initPieces() {
        // White pieces
        this.placeObjectAtPosition('A1', new Rook('white',  this.squarePositions['A1']));
        this.placeObjectAtPosition('B1', new Knight('white',  this.squarePositions['B1']));
        this.placeObjectAtPosition('C1', new Bishop('white',  this.squarePositions['C1']));
        this.placeObjectAtPosition('D1', new Queen('white',  this.squarePositions['D1']));
        this.placeObjectAtPosition('E1', new King('white',  this.squarePositions['E1']));
        this.placeObjectAtPosition('F1', new Bishop('white',  this.squarePositions['F1']));
        this.placeObjectAtPosition('G1', new Knight('white',  this.squarePositions['G1']));
        this.placeObjectAtPosition('H1', new Rook('white',  this.squarePositions['H1']));
    
        for (let i = 0; i < 8; i++) {
            const coordinate = String.fromCharCode(65 + i) + '2'
            this.placeObjectAtPosition(coordinate, new Pawn('white',this.squarePositions[coordinate]));
        }
    
        // Black pieces
        this.placeObjectAtPosition('A8', new Rook('black', this.squarePositions['A8']));
        this.placeObjectAtPosition('B8', new Knight('black', this.squarePositions['B8']));
        this.placeObjectAtPosition('C8', new Bishop('black', this.squarePositions['C8']));
        this.placeObjectAtPosition('D8', new Queen('black', this.squarePositions['D8']));
        this.placeObjectAtPosition('E8', new King('black', this.squarePositions['E8']));
        this.placeObjectAtPosition('F8', new Bishop('black', this.squarePositions['F8']));
        this.placeObjectAtPosition('G8', new Knight('black', this.squarePositions['G8']));
        this.placeObjectAtPosition('H8', new Rook('black', this.squarePositions['H8']));
    
        for (let i = 0; i < 8; i++) {
            const coordinate = String.fromCharCode(65 + i) + '7'
            this.placeObjectAtPosition(coordinate, new Pawn('black', this.squarePositions[coordinate]));
        }
    }
    
    async init() {
        this.createBoard();
        this.initPieces();
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

    createParticleLight() {
        const particleLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        
        particleLight.add(new THREE.PointLight(0xffffff, 0.6));
        
        return particleLight;
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
        
        const particleLight1 = this.createParticleLight();
        particleLight1.position.set(-boardSize / 2 - borderWidth / 2, 0, -boardSize / 2 - borderWidth / 2);
        this.model.add(particleLight1);
    
        const particleLight2 = this.createParticleLight();
        particleLight2.position.set(-boardSize / 2 - borderWidth / 2, 0, boardSize / 2 + borderWidth / 2);
        this.model.add(particleLight2);
    
        const particleLight3 = this.createParticleLight();
        particleLight3.position.set(boardSize / 2 + borderWidth / 2, 0, -boardSize / 2 - borderWidth / 2);
        this.model.add(particleLight3);
    
        const particleLight4 = this.createParticleLight();
        particleLight4.position.set(boardSize / 2 + borderWidth / 2, 0, boardSize / 2 + borderWidth / 2);
        this.model.add(particleLight4);

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