import { ChessPiece } from ".";

export class Pawn extends ChessPiece {
    constructor(color, initialPosition) {
        const modelURL = "/models/Pawn/Pawn.glb"; // URL to the pawn 3D model;
        const name = 'Pawn';
        super(modelURL, color, name);

        this.initialPosition = initialPosition;
        this.currentPosition = initialPosition.clone(); // Cloning to avoid reference issues
    }
}
