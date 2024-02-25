import { ChessPiece } from ".";

export class Bishop extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/Bishop/Bishop.glb"; // URL to the Bishop 3D model;
        const name = 'Bishop';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
