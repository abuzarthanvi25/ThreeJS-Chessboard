import { ChessPiece } from ".";

export class Knight extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/Knight/Knight.glb"; // URL to the Knight 3D model;
        const name = 'Knight';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
