import GUI from 'lil-gui'

export default class DebugUI {
    constructor() {

    }

    debugCamera(camera) {
        const gui = new GUI();

        const cameraTweaks = gui.addFolder('Camera Tweaks');
        cameraTweaks.add(camera.position, 'x', -10, 10).name('Position X');
        cameraTweaks.add(camera.position, 'y', -10, 10).name('Position Y');
        cameraTweaks.add(camera.position, 'z', -10, 10).name('Position Z');

        cameraTweaks.add(camera.rotation, 'x', -Math.PI, Math.PI).name('Rotation X');
        cameraTweaks.add(camera.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y');
        cameraTweaks.add(camera.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z');
    }

    randomDebugger(object) {
        const gui = new GUI();
        const positionFolder = gui.addFolder('Position');
        const rotationFolder = gui.addFolder('Rotation');

        positionFolder.add(object.position, 'x')
            .min(-20)
            .max(20)
            .step(0.000001)
        positionFolder.add(object.position, 'y')
            .min(-20)
            .max(20)
            .step(0.000001)
        positionFolder.add(object.position, 'z')
            .min(-20)
            .max(20)
            .step(0.000001)

        rotationFolder.add(object.rotation, 'x')
            .min(-20)
            .max(20)
            .step(0.000001)
        rotationFolder.add(object.rotation, 'y')
            .min(-20)
            .max(20)
            .step(0.000001)
        rotationFolder.add(object.rotation, 'z')
            .min(-20)
            .max(20)
            .step(0.000001)


    }
}