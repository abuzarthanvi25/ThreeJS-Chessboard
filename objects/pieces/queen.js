import { ChessPiece } from ".";

export class Queen extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/Queen/Queen.glb"; // URL to the Queen 3D model;
        const name = 'Queen';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
