import { ChessPiece } from ".";

export class King extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/King/King.glb"; // URL to the King 3D model;
        const name = 'King';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
