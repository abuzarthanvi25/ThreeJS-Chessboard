import { ChessPiece } from ".";

export class Rook extends ChessPiece {
    constructor(color) {
        const modelURL = "/models/Rook/Rook.glb"; // URL to the pawn 3D model;
        const name = 'Rook'
        super(modelURL, color, name);
    }
}