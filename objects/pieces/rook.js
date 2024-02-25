import { ChessPiece } from ".";

export class Rook extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/Rook/Rook.glb"; // URL to the Rook 3D model;
        const name = 'Rook';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
